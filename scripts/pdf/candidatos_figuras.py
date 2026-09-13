import argparse
import json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parents[2]


def carregar_calibracao() -> dict:
    calib_path = RAIZ / "scripts" / "pdf" / "calibracao.json"
    if calib_path.exists():
        with open(calib_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def bbox_valida(bbox, calib, largura_coluna=260.0) -> bool:
    x0, y0, x1, y1 = bbox
    largura = x1 - x0
    altura = y1 - y0
    area = largura * altura

    # Descarta se estiver no cabeçalho ou rodapé
    cabecalho_max_y = calib.get("cabecalho_max_y", 75.0)
    rodape_min_y = calib.get("rodape_min_y", 740.0)
    if y1 <= cabecalho_max_y or y0 >= rodape_min_y:
        return False

    # Descarta marcas de corte das bordas
    margem_esq = calib.get("margem_esquerda_min_x", 0.0)
    margem_dir = calib.get("margem_direita_max_x", 650.0)
    if x1 <= margem_esq or x0 >= margem_dir:
        return False

    return True


def unir_caixas_proximas(caixas, distancia_max=8.0):
    if not caixas:
        return []

    grupos = [[c] for c in caixas]
    mudou = True
    while mudou:
        mudou = False
        novos_grupos = []
        usados = set()
        for i in range(len(grupos)):
            if i in usados:
                continue
            grupo_atual = list(grupos[i])
            for j in range(i + 1, len(grupos)):
                if j in usados:
                    continue
                # Checa se algum retângulo de grupo_atual está próximo de algum de grupos[j]
                unir = False
                for r1 in grupo_atual:
                    for r2 in grupos[j]:
                        # Distância entre r1 e r2
                        dx = max(0, max(r1[0], r2[0]) - min(r1[2], r2[2]))
                        dy = max(0, max(r1[1], r2[1]) - min(r1[3], r2[3]))
                        if dx <= distancia_max and dy <= distancia_max:
                            unir = True
                            break
                    if unir:
                        break
                if unir:
                    grupo_atual.extend(grupos[j])
                    usados.add(j)
                    mudou = True
            novos_grupos.append(grupo_atual)
        grupos = novos_grupos

    # Reduz cada grupo ao seu bounding box envelope
    envelopes = []
    for grupo in grupos:
        min_x = min(r[0] for r in grupo)
        min_y = min(r[1] for r in grupo)
        max_x = max(r[2] for r in grupo)
        max_y = max(r[3] for r in grupo)
        envelopes.append([round(min_x, 2), round(min_y, 2), round(max_x, 2), round(max_y, 2)])
    return envelopes


def detectar_candidatos_pagina(page, calib) -> list:
    candidatos = []
    area_min_raster = calib.get("area_min_figura_raster", 1500.0)
    area_min_vetor = calib.get("area_min_figura_vetorial", 2000.0)

    # 1. Imagens Raster
    try:
        imagens_info = page.get_image_info(xrefs=True)
        for img in imagens_info:
            bbox = [round(v, 2) for v in img["bbox"]]
            area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
            if area >= area_min_raster and bbox_valida(bbox, calib):
                candidatos.append({
                    "tipo": "raster",
                    "bbox": bbox,
                    "area": round(area, 2),
                    "xref": img.get("xref"),
                })
    except Exception:
        pass

    # 2. Desenhos Vetoriais
    try:
        desenhos = page.get_drawings()
        caixas_vetoriais = []
        for d in desenhos:
            r = d["rect"]
            largura = r.width
            altura = r.height
            # Descarta linhas/réguas muito compridas e finas (> 150 pt de largura e altura < 3 pt)
            if altura < 3.0 and largura > 150.0:
                continue
            if largura < 3.0 and altura > 150.0:
                continue
            bbox = [r.x0, r.y0, r.x1, r.y1]
            if bbox_valida(bbox, calib):
                caixas_vetoriais.append(bbox)

        # Agrupa traços próximos
        grupos_vetor = unir_caixas_proximas(caixas_vetoriais, distancia_max=10.0)
        for g in grupos_vetor:
            area = (g[2] - g[0]) * (g[3] - g[1])
            if area >= area_min_vetor and bbox_valida(g, calib):
                # Expande com textos de rótulos próximos se houver
                candidatos.append({
                    "tipo": "vetorial",
                    "bbox": g,
                    "area": round(area, 2),
                })
    except Exception:
        pass

    return candidatos


def processar_prova(prova_id: str, paginas_alvo=None) -> dict:
    prova_path = RAIZ / "content" / "provas" / prova_id / "prova.json"
    if not prova_path.exists():
        raise FileNotFoundError(f"Arquivo prova.json não encontrado: {prova_path}")

    with open(prova_path, "r", encoding="utf-8") as f:
        prova_meta = json.load(f)

    calib_todas = carregar_calibracao()
    calib = calib_todas.get(prova_id, {})

    pdf_path = RAIZ / prova_meta["arquivoProva"]
    doc = fitz.open(pdf_path)

    saida_dir = RAIZ / "work" / "candidatos" / prova_id
    saida_dir.mkdir(parents=True, exist_ok=True)

    candidatos_por_pagina = {}
    total_encontrados = 0

    dpi = 110
    zoom = dpi / 72.0
    matriz = fitz.Matrix(zoom, zoom)

    for idx, page in enumerate(doc):
        num_pag = idx + 1
        if paginas_alvo and num_pag not in paginas_alvo:
            continue

        cands = detectar_candidatos_pagina(page, calib)
        if cands:
            candidatos_por_pagina[num_pag] = cands
            total_encontrados += len(cands)

            # Renderiza PNG com as caixas candidatas anotadas
            pix = page.get_pixmap(matrix=matriz, alpha=False)
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            draw = ImageDraw.Draw(img)

            try:
                fonte = ImageFont.load_default()
            except Exception:
                fonte = None

            for i, cand in enumerate(cands, start=1):
                b = cand["bbox"]
                x0 = int(b[0] * zoom)
                y0 = int(b[1] * zoom)
                x1 = int(b[2] * zoom)
                y1 = int(b[3] * zoom)
                cor = (230, 20, 20) if cand["tipo"] == "raster" else (20, 100, 230)
                draw.rectangle([x0, y0, x1, y1], outline=cor, width=2)
                draw.text((x0 + 4, y0 + 4), f"#{i} [{cand['tipo']}]", fill=cor, font=fonte)

            anotada_file = saida_dir / f"p{num_pag:03d}.png"
            img.save(anotada_file, "PNG")

    doc.close()

    resultado = {
        "provaId": prova_id,
        "totalCandidatos": total_encontrados,
        "paginasComCandidatos": len(candidatos_por_pagina),
        "candidatos": candidatos_por_pagina,
    }

    manifesto_cands = RAIZ / "work" / "candidatos" / f"{prova_id}.json"
    manifesto_cands.parent.mkdir(parents=True, exist_ok=True)
    manifesto_cands.write_text(json.dumps(resultado, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"[{prova_id}] Candidatos de figuras: {total_encontrados} encontrados em {len(candidatos_por_pagina)} páginas -> {manifesto_cands}")
    return resultado


def main():
    parser = argparse.ArgumentParser(description="Detecta candidatos de figuras raster e vetoriais.")
    parser.add_argument("prova_id", nargs="?", help="ID da prova ou 'todas'")
    parser.add_argument("--paginas", type=int, nargs="*", help="Páginas específicas a analisar")
    args = parser.parse_args()

    provas = ["2021-licenciatura", "2025-prova1", "2025-prova5"]
    if args.prova_id and args.prova_id != "todas":
        provas = [args.prova_id]

    for p in provas:
        processar_prova(p, paginas_alvo=args.paginas)


if __name__ == "__main__":
    main()
