"""Testes de candidatos_figuras.py, mapear_figuras_completo.py e recortar.py (CR-21, CR-22, CR-23).

Executar: .venv\\Scripts\\python -m unittest discover -s tests/python
"""
import contextlib
import importlib
import io
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts" / "pdf"))
import candidatos_figuras  # noqa: E402
import recortar  # noqa: E402


class CandidatosFigurasTest(unittest.TestCase):
    def test_falha_do_pymupdf_e_registrada_com_o_numero_da_pagina(self):
        pagina = mock.Mock()
        pagina.number = 6  # 0-based: página 7
        pagina.get_image_info.side_effect = RuntimeError("xref corrompido")
        pagina.get_drawings.side_effect = RuntimeError("desenho inválido")
        erros = io.StringIO()
        with contextlib.redirect_stderr(erros):
            candidatos = candidatos_figuras.detectar_candidatos_pagina(pagina, {})
        self.assertEqual(candidatos, [])
        self.assertIn("p.7", erros.getvalue())
        self.assertIn("xref corrompido", erros.getvalue())
        self.assertIn("desenho inválido", erros.getvalue())


class MapearFigurasCompletoTest(unittest.TestCase):
    def test_importar_nao_executa_a_varredura(self):
        saida = io.StringIO()
        sys.modules.pop("mapear_figuras_completo", None)
        with contextlib.redirect_stdout(saida), mock.patch("fitz.open") as abrir:
            importlib.import_module("mapear_figuras_completo")
        abrir.assert_not_called()
        self.assertEqual(saida.getvalue(), "")

    def test_varre_todas_as_paginas_com_questoes(self):
        modulo = importlib.import_module("mapear_figuras_completo")
        # 2025-prova1: questões de p.2 a p.47 (Q80 está na p.47); p.48 é o questionário.
        self.assertEqual(modulo.paginas_com_questoes("2025-prova1"), range(2, 48))
        self.assertEqual(modulo.paginas_com_questoes("2025-prova5"), range(2, 46))
        self.assertEqual(modulo.paginas_com_questoes("2021-licenciatura"), range(2, 36))


class FolhaContatoTest(unittest.TestCase):
    def test_conteudo_interpolado_e_escapado(self):
        figura = {
            "arquivo": "q001-f1.webp",
            "pagina": 3,
            "bbox": [0, 0, 10, 10],
            "uso": {"questaoId": "<script>alert(1)</script>", "papel": "enunciado"},
            "status": "aprovado",
        }
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(recortar, "RAIZ", Path(tmp)):
            html = recortar.gerar_folha_contato("2025-prova1", [figura], Path(tmp)).read_text(encoding="utf-8")
        self.assertNotIn("<script>", html)
        self.assertIn("&lt;script&gt;", html)


if __name__ == "__main__":
    unittest.main()
