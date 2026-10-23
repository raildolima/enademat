import json
import fitz
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]

# Páginas que contêm questões (conferido com as páginas registradas em content/provas/*/questoes).
# Ficam de fora a capa/instruções (p.1) e o final do caderno: rascunho e Questionário de Percepção
# (2021 p.36; 2025-prova1 p.48; 2025-prova5 p.47; 2026-prova1 p.45), conforme a especificação 0.1.
ULTIMA_PAGINA_COM_QUESTOES = {
    "2021-licenciatura": 35,
    "2025-prova1": 47,
    "2025-prova5": 45,
    "2026-prova1": 44,
}


def paginas_com_questoes(prova_id: str) -> range:
    return range(2, ULTIMA_PAGINA_COM_QUESTOES[prova_id] + 1)


def extrair_figuras_reais(prova_id: str):
    prova_path = RAIZ / "content" / "provas" / prova_id / "prova.json"
    prova = json.loads(prova_path.read_text("utf-8"))
    doc = fitz.open(RAIZ / prova["arquivoProva"])

    calib = json.loads((RAIZ / "scripts" / "pdf" / "calibracao.json").read_text("utf-8")).get(prova_id, {})
    cabecalho_y = calib.get("cabecalho_max_y", 75.0)
    rodape_y = calib.get("rodape_min_y", 740.0)
    margem_esq = calib.get("margem_esquerda_min_x", 20.0)
    margem_dir = calib.get("margem_direita_max_x", 580.0)

    figuras_encontradas = []

    for num_pag in paginas_com_questoes(prova_id):
        page = doc[num_pag - 1]

        # 1. Raster
        imgs = page.get_image_info(xrefs=True)
        for im in imgs:
            b = [round(v, 2) for v in im["bbox"]]
            largura = b[2] - b[0]
            altura = b[3] - b[1]
            area = largura * altura
            # Filtro: área mínima e fora do cabeçalho/rodapé
            if area >= 1500.0 and b[1] >= cabecalho_y and b[3] <= rodape_y and b[0] >= margem_esq and b[2] <= margem_dir:
                figuras_encontradas.append({
                    "pagina": num_pag,
                    "tipo": "raster",
                    "bbox": b,
                    "area": round(area, 1),
                    "xref": im.get("xref")
                })

    doc.close()
    print(f"[{prova_id}] Total de figuras raster válidas no miolo: {len(figuras_encontradas)}")
    for f in figuras_encontradas:
        print(f"  p.{f['pagina']:02d}: bbox={f['bbox']} area={f['area']} (xref {f.get('xref')})")
    return figuras_encontradas


if __name__ == "__main__":
    for p in ["2021-licenciatura", "2025-prova1", "2025-prova5", "2026-prova1"]:
        print(f"\n==================== {p} ====================")
        extrair_figuras_reais(p)
