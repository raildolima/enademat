"""Testes de scripts/pdf/extrair_gabaritos.py (CR-18).

Executar: .venv\\Scripts\\python -m unittest discover -s tests/python
"""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "pdf"))
import extrair_gabaritos as g  # noqa: E402


def gabarito(prova_id: str, referencia: list, discursivas: list, vazias=()) -> dict:
    return {
        "provaId": prova_id,
        "fonte": f"{prova_id}.pdf",
        "objetivas": {str(i): ("" if i in vazias else letra) for i, letra in enumerate(referencia, start=1)},
        "discursivas": discursivas,
    }


def leituras(p1_vazias=range(1, 81), p5_trocada=None):
    g2021 = gabarito("2021-licenciatura", g.REFERENCIA_2021, ["D1", "D2", "D3", "D4", "D5"])
    g_p1 = gabarito("2025-prova1", g.REFERENCIA_2025_P1, ["D1"], vazias=set(p1_vazias))
    g_p5 = gabarito("2025-prova5", g.REFERENCIA_2025_P5, ["D1"])
    if p5_trocada:
        numero, letra = p5_trocada
        g_p5["objetivas"][str(numero)] = letra
    return g2021, g_p1, g_p5


class ExtrairGabaritosTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.raiz = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def executar(self, args, g2021, g_p1, g_p5):
        with mock.patch.object(g, "extrair_2021", return_value=g2021), mock.patch.object(
            g, "extrair_2025_p1", return_value=g_p1
        ), mock.patch.object(g, "extrair_2025_p5", return_value=g_p5):
            return g.conferir_e_salvar(args, raiz=self.raiz)

    def destino(self, prova_id: str) -> Path:
        return self.raiz / "content" / "provas" / prova_id / "gabarito.json"

    def test_extrair_p1_nao_preenche_com_a_referencia(self):
        # O PDF real da Prova 1 não tem camada de texto com a tabela: nada pode vir da referência.
        lido = g.extrair_2025_p1()
        self.assertTrue(all(letra in ("", "A", "B", "C", "D") for letra in lido["objetivas"].values()))
        nao_lidas = [q for q, letra in lido["objetivas"].items() if letra == ""]
        self.assertEqual(len(nao_lidas), 80)

    def test_questoes_nao_lidas_falham_sem_conferencia_visual(self):
        codigo = self.executar([], *leituras())
        self.assertEqual(codigo, 1)
        self.assertFalse(self.destino("2025-prova1").exists())

    def test_conferencia_visual_explicita_aceita_a_referencia(self):
        codigo = self.executar(["--conferencia-visual-p1"], *leituras())
        self.assertEqual(codigo, 0)
        gravado = json.loads(self.destino("2025-prova1").read_text(encoding="utf-8"))
        self.assertEqual([gravado["objetivas"][str(i)] for i in range(1, 81)], g.REFERENCIA_2025_P1)

    def test_divergencia_retorna_codigo_de_erro_e_nao_grava(self):
        codigo = self.executar(["--conferencia-visual-p1"], *leituras(p5_trocada=(7, "A")))
        self.assertEqual(codigo, 1)
        self.assertFalse(self.destino("2025-prova5").exists())

    def test_nao_sobrescreve_gabarito_existente_diferente(self):
        destino = self.destino("2021-licenciatura")
        destino.parent.mkdir(parents=True)
        destino.write_text('{"alterado": true}', encoding="utf-8")
        codigo = self.executar(["--conferencia-visual-p1"], *leituras())
        self.assertEqual(codigo, 1)
        self.assertEqual(destino.read_text(encoding="utf-8"), '{"alterado": true}')

    def test_gabarito_existente_identico_e_mantido(self):
        self.assertEqual(self.executar(["--conferencia-visual-p1"], *leituras()), 0)
        antes = self.destino("2021-licenciatura").stat().st_mtime_ns
        self.assertEqual(self.executar(["--conferencia-visual-p1"], *leituras()), 0)
        self.assertEqual(self.destino("2021-licenciatura").stat().st_mtime_ns, antes)


if __name__ == "__main__":
    unittest.main()
