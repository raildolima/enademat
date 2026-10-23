import argparse
import json
import re
from pathlib import Path
import fitz  # PyMuPDF

RAIZ = Path(__file__).resolve().parents[2]


def processar_prova(prova_id: str) -> dict:
    prova_path = RAIZ / "content" / "provas" / prova_id / "prova.json"
    if not prova_path.exists():
        raise FileNotFoundError(f"Arquivo prova.json não encontrado em: {prova_path}")

    with open(prova_path, "r", encoding="utf-8") as f:
        prova_meta = json.load(f)

    pdf_path = RAIZ / prova_meta["arquivoProva"]
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF não encontrado: {pdf_path}")

    saida_dir = RAIZ / "work" / "inventario" / prova_id
    saida_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    resumo_paginas = []
    textos_base_detectados = []
    questoes_detectadas = []

    padrao_texto_base = re.compile(
        r"Texto\s+para\s+(?:as\s+)?questões\s+(\d+)\s+e\s+(\d+)|Texto\s+para\s+(?:as\s+)?questões\s+(\d+)\s+a\s+(\d+)",
        re.IGNORECASE,
    )
    padrao_questao = re.compile(
        r"(?:^|\n)\s*QUESTÃO\s+(\d+)",
        re.IGNORECASE,
    )
    padrao_discursiva = re.compile(
        r"(?:^|\n)\s*QUESTÃO\s+DISCURSIVA\s+(\d+)|PADRÃO\s+DE\s+RESPOSTA\s+-\s+DISCURSIVA\s+(\d+)|QUESTÃO\s+DISCURSIVA",
        re.IGNORECASE,
    )

    for idx, page in enumerate(doc):
        num_pag = idx + 1
        texto = page.get_text("text")
        
        # Salva texto puro da página
        txt_file = saida_dir / f"p{num_pag:03d}.txt"
        txt_file.write_text(texto, encoding="utf-8")

        # Busca textos-base
        for match in padrao_texto_base.finditer(texto):
            q_inicio = match.group(1) or match.group(3)
            q_fim = match.group(2) or match.group(4)
            textos_base_detectados.append({
                "pagina": num_pag,
                "texto_match": match.group(0).strip(),
                "questoes": [int(q_inicio), int(q_fim)],
            })

        # Busca questões objetivas
        for match in padrao_questao.finditer(texto):
            num_q = int(match.group(1))
            questoes_detectadas.append({
                "pagina": num_pag,
                "tipo": "objetiva",
                "numero": num_q,
            })

        # Busca questões discursivas
        for match in padrao_discursiva.finditer(texto):
            num_disc = match.group(1) or match.group(2) or "geral"
            questoes_detectadas.append({
                "pagina": num_pag,
                "tipo": "discursiva",
                "numero": num_disc,
            })

        resumo_paginas.append({
            "pagina": num_pag,
            "largura_pt": round(page.rect.width, 2),
            "altura_pt": round(page.rect.height, 2),
            "total_caracteres": len(texto),
            "total_imagens_raster": len(page.get_images()),
            "total_vetores": len(page.get_drawings()),
        })

    doc.close()

    resultado = {
        "provaId": prova_id,
        "arquivoProva": prova_meta["arquivoProva"],
        "totalPaginas": len(resumo_paginas),
        "paginas": resumo_paginas,
        "textosBaseDetectados": textos_base_detectados,
        "questoesDetectadas": questoes_detectadas,
    }

    manifesto_file = saida_dir / "inventario.json"
    manifesto_file.write_text(json.dumps(resultado, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[{prova_id}] Inventário concluído: {len(resumo_paginas)} páginas processadas -> {manifesto_file}")
    return resultado


def main():
    parser = argparse.ArgumentParser(description="Gera inventário de páginas e texto de uma prova do ENADE.")
    parser.add_argument("prova_id", nargs="?", help="ID da prova (ex: 2021-licenciatura, 2025-prova1, 2025-prova5, 2026-prova1) ou 'todas'")
    args = parser.parse_args()

    provas = ["2021-licenciatura", "2025-prova1", "2025-prova5", "2026-prova1"]
    if args.prova_id and args.prova_id != "todas":
        provas = [args.prova_id]

    for p in provas:
        processar_prova(p)


if __name__ == "__main__":
    main()
