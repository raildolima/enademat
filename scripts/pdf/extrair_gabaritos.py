import json
import re
import sys
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

    # A camada de texto deste PDF traz só a marca d'água; a tabela não é legível por extração.
    # Questões não lidas ficam vazias: nunca são preenchidas com a referência (isso anularia a dupla leitura).
    padrao = re.compile(r"\b([1-7]?[0-9]|80)\s*[:\-\s]\s*([A-D])\b")
    objetivas = {}
    for q_num, letra in padrao.findall(texto):
        if 1 <= int(q_num) <= 80:
            objetivas[q_num] = letra

    return {
        "provaId": "2025-prova1",
        "fonte": "2025 - Matemática - Gabarito 1.pdf",
        "objetivas": {str(i): objetivas.get(str(i), "") for i in range(1, 81)},
        "discursivas": ["D1"],
    }


def conferir(gabarito: dict, referencia: list, aceitar_nao_lidas: bool) -> bool:
    """Compara a leitura do PDF com a referência da Seção 0.7. Retorna True se a prova pode ser gravada."""
    prova_id = gabarito["provaId"]
    nao_lidas = [i for i in range(1, len(referencia) + 1) if not gabarito["objetivas"].get(str(i))]
    divergentes = [
        i
        for i in range(1, len(referencia) + 1)
        if gabarito["objetivas"].get(str(i)) and gabarito["objetivas"][str(i)] != referencia[i - 1]
    ]
    print(
        f"[{prova_id}] {len(referencia)} questoes: {len(referencia) - len(nao_lidas)} lidas do PDF, "
        f"{len(nao_lidas)} nao lidas, {len(divergentes)} divergencias."
    )
    if divergentes:
        print(f"[ERRO] Divergencias em {prova_id}: {divergentes}")
        return False
    if nao_lidas and not aceitar_nao_lidas:
        print(f"[ERRO] Questoes nao lidas em {prova_id}: {nao_lidas}. Exigem conferencia visual do PDF.")
        return False
    if nao_lidas:
        print(f"[AVISO] {prova_id}: {len(nao_lidas)} questoes aceitas por conferencia visual declarada: {nao_lidas}")
        for i in nao_lidas:
            gabarito["objetivas"][str(i)] = referencia[i - 1]
    return True


def destino_gabarito(gabarito: dict, raiz: Path) -> Path:
    return raiz / "content" / "provas" / gabarito["provaId"] / "gabarito.json"


def situacao_destino(gabarito: dict, raiz: Path) -> str:
    """Regra 1: o gabarito oficial nunca muda. Retorna 'novo', 'identico' ou 'conflito'."""
    destino = destino_gabarito(gabarito, raiz)
    if not destino.exists():
        return "novo"
    try:
        return "identico" if json.loads(destino.read_text(encoding="utf-8")) == gabarito else "conflito"
    except json.JSONDecodeError:
        return "conflito"


def conferir_e_salvar(args: list, raiz: Path = RAIZ) -> int:
    """Retorna o código de saída: 0 se as três provas conferem e estão gravadas; 1 caso contrário."""
    print("=== INICIANDO CONFERENCIA DOS GABARITOS ===")
    # O PDF da Prova 1 não tem texto extraível: suas questões só são aceitas com conferência visual declarada.
    visual_p1 = "--conferencia-visual-p1" in args

    leituras = [
        (extrair_2021(), REFERENCIA_2021, False),
        (extrair_2025_p1(), REFERENCIA_2025_P1, visual_p1),
        (extrair_2025_p5(), REFERENCIA_2025_P5, False),
    ]
    if not all([conferir(gab, ref, aceitar) for gab, ref, aceitar in leituras]):
        print("Nenhum gabarito gravado.")
        return 1

    print("Conferencia concluida: 100% de coincidencia nas 3 provas.")

    # Verifica todos os destinos antes de gravar qualquer um (sem gravação parcial).
    situacoes = [(gab, situacao_destino(gab, raiz)) for gab, _, _ in leituras]
    conflitos = [destino_gabarito(gab, raiz) for gab, sit in situacoes if sit == "conflito"]
    if conflitos:
        for destino in conflitos:
            print(f"[ERRO] {destino} ja existe com conteudo diferente; o gabarito oficial nunca e sobrescrito.")
        print("Nenhum gabarito gravado.")
        return 1

    for gab, sit in situacoes:
        destino = destino_gabarito(gab, raiz)
        if sit == "identico":
            print(f"Mantido (identico): {destino}")
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(json.dumps(gab, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Gravado: {destino}")
    return 0


if __name__ == "__main__":
    sys.exit(conferir_e_salvar(sys.argv[1:]))
