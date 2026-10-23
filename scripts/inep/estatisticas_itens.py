"""Índice de acerto nacional por questão (RF16) a partir dos microdados do Enade (INEP).

Uso:
    .venv\\Scripts\\python scripts/inep/estatisticas_itens.py

Pré-requisito: microdados baixados e descompactados em work/inep/ (gitignored):
    work/inep/2021/  <- https://download.inep.gov.br/microdados/microdados_enade_2021.zip
    work/inep/2025/  <- https://download.inep.gov.br/microdados/microdados_enade_licenciaturas_2025.zip

Considera só cursos do grupo 702 (Matemática — Licenciatura) e estudantes com presença válida (TP_PRES = 555).
O gabarito final de cada microdado é conferido com content/provas/<id>/gabarito.json: qualquer divergência
interrompe o script; itens marcados como anulados no microdado ("X" ou "6") são registrados como anulados.
Grava content/provas/<id>/estatisticas.json. Provas com menos de MIN_PRESENTES estudantes não são gravadas.
"""

import csv
import glob
import json
import sys
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
GRUPO_MATEMATICA_LICENCIATURA = "702"
PRESENCA_VALIDA = "555"
MIN_PRESENTES = 100
MARCAS_ANULADA = {"X", "6"}
LETRAS = ["A", "B", "C", "D", "E"]

# provaId -> (ano, padrão da pasta de dados, filtro de caderno ou None, colunas de gabarito e respostas)
FONTES = {
    "2021-licenciatura": {
        "ano": 2021,
        "dados": "work/inep/2021/*/2.DADOS/",
        "prefixo": "microdados2021",
        "caderno": None,
        "gabarito": ["DS_VT_GAB_OFG_FIN", "DS_VT_GAB_OCE_FIN"],
        "respostas": ["DS_VT_ESC_OFG", "DS_VT_ESC_OCE"],
        "url": "https://download.inep.gov.br/microdados/microdados_enade_2021.zip",
    },
    "2025-prova1": {
        "ano": 2025,
        "dados": "work/inep/2025/*/2.DADOS/",
        "prefixo": "microdados2025",
        "caderno": "1",
        "gabarito": ["DS_VT_GAB_OBJ"],
        "respostas": ["DS_VT_ESC_OBJ"],
        "url": "https://download.inep.gov.br/microdados/microdados_enade_licenciaturas_2025.zip",
    },
    "2025-prova5": {
        "ano": 2025,
        "dados": "work/inep/2025/*/2.DADOS/",
        "prefixo": "microdados2025",
        "caderno": "5",
        "gabarito": ["DS_VT_GAB_OBJ"],
        "respostas": ["DS_VT_ESC_OBJ"],
        "url": "https://download.inep.gov.br/microdados/microdados_enade_licenciaturas_2025.zip",
    },
}


def ler(arquivo: Path):
    with open(arquivo, encoding="latin-1", newline="") as f:
        yield from csv.DictReader(f, delimiter=";")


def cursos_do_grupo(pasta: Path, prefixo: str) -> set:
    return {r["CO_CURSO"] for r in ler(pasta / f"{prefixo}_arq1.txt") if r["CO_GRUPO"] == GRUPO_MATEMATICA_LICENCIATURA}


def calcular(prova_id: str, cfg: dict) -> dict | None:
    pastas = glob.glob(str(RAIZ / cfg["dados"]))
    if not pastas:
        print(f"[{prova_id}] microdados ausentes em {cfg['dados']} (baixe {cfg['url']})")
        return None
    pasta = Path(pastas[0])
    cursos = cursos_do_grupo(pasta, cfg["prefixo"])

    gabaritos = Counter()
    contagens: list[Counter] | None = None
    presentes = 0
    for r in ler(pasta / f"{cfg['prefixo']}_arq3.txt"):
        if r["CO_CURSO"] not in cursos or r["TP_PRES"] != PRESENCA_VALIDA:
            continue
        if cfg["caderno"] is not None and r["CO_CADERNO"] != cfg["caderno"]:
            continue
        gabarito = "".join(r[c] for c in cfg["gabarito"]).strip()
        respostas = "".join(r[c] for c in cfg["respostas"])
        # Há registros "presentes" sem vetor de gabarito/respostas no microdado: ficam de fora da conta
        if not gabarito or len(respostas) != len(gabarito):
            continue
        gabaritos[gabarito] += 1
        if contagens is None:
            contagens = [Counter() for _ in respostas]
        for i, c in enumerate(respostas):
            contagens[i][c] += 1
        presentes += 1

    if presentes < MIN_PRESENTES or contagens is None:
        print(f"[{prova_id}] apenas {presentes} presentes (mínimo {MIN_PRESENTES}): estatísticas não gravadas.")
        return None
    if len(gabaritos) != 1:
        sys.exit(f"[{prova_id}] mais de um gabarito no microdado: {gabaritos.most_common(3)}")
    gab_inep = next(iter(gabaritos))

    gab_oficial = json.loads((RAIZ / "content/provas" / prova_id / "gabarito.json").read_text("utf-8"))["objetivas"]
    if len(gab_inep) != len(gab_oficial):
        sys.exit(f"[{prova_id}] microdado tem {len(gab_inep)} itens; gabarito.json tem {len(gab_oficial)}.")

    itens = {}
    for i, letra_inep in enumerate(gab_inep):
        numero = str(i + 1)
        anulada = letra_inep in MARCAS_ANULADA
        if not anulada and letra_inep != gab_oficial[numero]:
            sys.exit(f"[{prova_id}] Q{numero}: microdado {letra_inep} x gabarito.json {gab_oficial[numero]}.")
        c = contagens[i]
        distribuicao = {letra: round(100 * c[letra] / presentes, 1) for letra in LETRAS if c[letra]}
        outras = presentes - sum(c[letra] for letra in LETRAS)
        item = {"anulada": anulada, "distribuicao": distribuicao, "brancoOuInvalida": round(100 * outras / presentes, 1)}
        if not anulada:
            item["acerto"] = round(100 * c[gab_oficial[numero]] / presentes, 1)
        itens[numero] = item

    anuladas = [n for n, it in itens.items() if it["anulada"]]
    print(f"[{prova_id}] {presentes} presentes; gabarito conferido; anuladas no gabarito final do INEP: {anuladas or 'nenhuma'}")
    return {
        "provaId": prova_id,
        "fonte": (
            f"INEP — Microdados do Enade {cfg['ano']} ({cfg['url']}), licença CC BY-ND 3.0. "
            "Cálculo do simulador: cursos de Matemática (Licenciatura), estudantes com presença válida"
            + (f", caderno {cfg['caderno']}" if cfg["caderno"] else "")
            + "."
        ),
        "presentes": presentes,
        "itens": itens,
    }


def main() -> None:
    for prova_id, cfg in FONTES.items():
        dados = calcular(prova_id, cfg)
        if dados:
            destino = RAIZ / "content/provas" / prova_id / "estatisticas.json"
            destino.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"[{prova_id}] gravado {destino.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
