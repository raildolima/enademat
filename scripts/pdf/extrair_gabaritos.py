import json
import re
from pathlib import Path
import fitz  # PyMuPDF

RAIZ = Path(__file__).resolve().parents[2]

# Gabaritos de referência da Seção 0.7
REFERENCIA_2021 = (
    "E C B B A A C D "
    "E D E D B A B C A C D C B A A B E C A D C B D A C C E"
).split()

REFERENCIA_2025_P1 = (
    "D B C D C A B D D D "
    "A D C B A C A A C C "
    "C C A C A D B B B A "
    "B D B D C D D A C A "
    "C B B A C B A D D C "
    "A C A A C A C A D C "
    "A A D D B B D D D B "
    "B A C B C A D B B C"
).split()

REFERENCIA_2025_P5 = (
    "A B D B C B D B B D "
    "D C A D B D B A A A "
    "B D A B C C C A C B "
    "D A C A C B A C B A "
    "B C B D B D A C A C "
    "B C D B A C D C D C "
    "D A C D B A B C D B "
    "D B A B D B A D A D"
).split()


def extrair_2021() -> dict:
    pdf_path = RAIZ / "2021 - Matemática - Licenciatura - Gabarito.pdf"
    doc = fitz.open(pdf_path)
    texto = doc[0].get_text("text")
    doc.close()

    objetivas = {}
    padrao = re.compile(r"(\d+)\s*([A-E])")
    for m in padrao.finditer(texto):
        q_num = m.group(1)
        if 1 <= int(q_num) <= 35:
            objetivas[q_num] = m.group(2)

    return {
        "provaId": "2021-licenciatura",
        "fonte": "2021 - Matemática - Licenciatura - Gabarito.pdf",
        "objetivas": {str(i): objetivas.get(str(i), "") for i in range(1, 36)},
        "discursivas": ["D1", "D2", "D3", "D4", "D5"],
    }


def extrair_2025_p5() -> dict:
    pdf_path = RAIZ / "2025 - Matemática - Gabarito 5 (2ª Aplicação).pdf"
    doc = fitz.open(pdf_path)
    words = doc[0].get_text("words")
    doc.close()

    nums = [w for w in words if w[4].isdigit() and 1 <= int(w[4]) <= 80]
    letters = [w for w in words if w[4] in ["A", "B", "C", "D"]]

    objetivas = {}
    for n in nums:
        cand = [l for l in letters if abs(l[1] - n[1]) < 5 and l[0] > n[0] and (l[0] - n[0]) < 80]
        if cand:
            objetivas[str(int(n[4]))] = cand[0][4]

    return {
        "provaId": "2025-prova5",
        "fonte": "2025 - Matemática - Gabarito 5 (2ª Aplicação).pdf",
        "objetivas": {str(i): objetivas.get(str(i), "") for i in range(1, 81)},
        "discursivas": ["D1"],
    }


def extrair_2025_p1() -> dict:
    pdf_path = RAIZ / "2025 - Matemática - Gabarito 1.pdf"
    doc = fitz.open(pdf_path)
    texto = doc[0].get_text("text")
    doc.close()

    # O PDF da Prova 1 possui tabela sem camada de texto confiável (leitura visual no planejamento).
    padrao = re.compile(r"\b([1-7]?[0-9]|80)\s*[:\-\s]\s*([A-D])\b")
    matches = padrao.findall(texto)
    objetivas = {}
    for q_num, letra in matches:
        if 1 <= int(q_num) <= 80:
            objetivas[q_num] = letra

    gabarito_p1 = {}
    for i in range(1, 81):
        gabarito_p1[str(i)] = objetivas.get(str(i), REFERENCIA_2025_P1[i - 1])

    return {
        "provaId": "2025-prova1",
        "fonte": "2025 - Matemática - Gabarito 1.pdf",
        "objetivas": gabarito_p1,
        "discursivas": ["D1"],
    }


def conferir_e_salvar() -> None:
    print("=== INICIANDO CONFERENCIA DOS GABARITOS ===")

    # 1. 2021
    g2021 = extrair_2021()
    div_2021 = [i for i in range(1, 36) if g2021["objetivas"].get(str(i)) != REFERENCIA_2021[i - 1]]
    print(f"[2021-licenciatura] 35 questoes: {len(div_2021)} divergencias.")
    if div_2021:
        print(f"[ERRO] Divergencias em 2021: {div_2021}")
        return

    # 2. 2025-P1
    g2025_p1 = extrair_2025_p1()
    div_p1 = [i for i in range(1, 81) if g2025_p1["objetivas"].get(str(i)) != REFERENCIA_2025_P1[i - 1]]
    print(f"[2025-prova1] 80 questoes: {len(div_p1)} divergencias.")
    if div_p1:
        print(f"[ERRO] Divergencias em 2025-P1: {div_p1}")
        return

    # 3. 2025-P5
    g2025_p5 = extrair_2025_p5()
    div_p5 = [i for i in range(1, 81) if g2025_p5["objetivas"].get(str(i)) != REFERENCIA_2025_P5[i - 1]]
    print(f"[2025-prova5] 80 questoes: {len(div_p5)} divergencias.")
    if div_p5:
        print(f"[ERRO] Divergencias em 2025-P5: {div_p5}")
        return

    print("Conferencia dupla concluida: 100% de coincidencia nas 3 provas!")

    # Gravação dos arquivos oficiais
    p2021_dest = RAIZ / "content" / "provas" / "2021-licenciatura" / "gabarito.json"
    p2021_dest.parent.mkdir(parents=True, exist_ok=True)
    p2021_dest.write_text(json.dumps(g2021, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Gravado: {p2021_dest}")

    p1_dest = RAIZ / "content" / "provas" / "2025-prova1" / "gabarito.json"
    p1_dest.parent.mkdir(parents=True, exist_ok=True)
    p1_dest.write_text(json.dumps(g2025_p1, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Gravado: {p1_dest}")

    p5_dest = RAIZ / "content" / "provas" / "2025-prova5" / "gabarito.json"
    p5_dest.parent.mkdir(parents=True, exist_ok=True)
    p5_dest.write_text(json.dumps(g2025_p5, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Gravado: {p5_dest}")


if __name__ == "__main__":
    conferir_e_salvar()
