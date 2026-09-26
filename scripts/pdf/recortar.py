import argparse
import html
import json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image, ImageChops

RAIZ = Path(__file__).resolve().parents[2]


def esc(valor) -> str:
    """Valores do manifesto são texto: escapados para não virarem tags na folha de contato."""
    return html.escape(str(valor))


def aparar(img: Image.Image, limiar: int = 245, margem: int = 6) -> Image.Image:
    mascara = ImageChops.invert(img.convert("L").point(lambda p: 255 if p > limiar else 0))
    caixa = mascara.getbbox()
    if not caixa:
        return img
    x0, y0, x1, y1 = caixa
    return img.crop((
        max(0, x0 - margem),
        max(0, y0 - margem),
        min(img.width, x1 + margem),
        min(img.height, y1 + margem),
    ))


def gerar_folha_contato(prova_id: str, figuras: list, destino_dir: Path) -> Path:
    out_dir = RAIZ / "work" / "conferencia"
    out_dir.mkdir(parents=True, exist_ok=True)
    html_path = out_dir / f"figuras-{prova_id}.html"

    cards = []
    for fig in figuras:
        arq_nome = fig["arquivo"]
        webp_path = destino_dir / arq_nome
        # Caminho relativo para a folha de contato em work/conferencia/
        rel_img = f"../../public/figuras/{prova_id}/{arq_nome}"
        
        largura, altura = 0, 0
        if webp_path.exists():
            with Image.open(webp_path) as im:
                largura, altura = im.size

        uso = fig.get("uso", {})
        letra_str = f" · Letra: <strong>{esc(uso.get('letra'))}</strong>" if uso.get("letra") else ""
        
        cards.append(f"""
        <div class="figura-card">
          <div class="img-wrap">
            <img src="{esc(rel_img)}" alt="{esc(arq_nome)}" loading="lazy" />
          </div>
          <div class="meta">
            <h4>{esc(arq_nome)}</h4>
            <p><strong>Página:</strong> {esc(fig['pagina'])} | <strong>Dimensões:</strong> {largura}×{altura} px</p>
            <p><strong>Uso:</strong> {esc(uso.get('questaoId', '-'))} ({esc(uso.get('papel', '-'))}){letra_str}</p>
            <p><strong>BBox:</strong> <code>{esc(fig['bbox'])}</code> | <strong>DPI:</strong> {esc(fig.get('dpi', 220))}</p>
            <p><strong>Status:</strong> <span class="badge {esc(fig.get('status'))}">{esc(fig.get('status'))}</span></p>
          </div>
        </div>
        """)

    html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Folha de Contato — Figuras {prova_id}</title>
  <style>
    body {{ font-family: system-ui, -apple-system, sans-serif; margin: 24px; background: #f0f2f5; color: #1a1a1a; }}
    h1 {{ color: #0d47a1; margin-bottom: 8px; }}
    p.sub {{ color: #555; margin-bottom: 24px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }}
    .figura-card {{ background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06); display: flex; flex-direction: column; }}
    .img-wrap {{ background: #fafafa; padding: 16px; display: flex; align-items: center; justify-content: center; min-height: 180px; border-bottom: 1px solid #eee; }}
    .img-wrap img {{ max-width: 100%; max-height: 280px; object-fit: contain; }}
    .meta {{ padding: 14px; font-size: 13px; line-height: 1.5; }}
    .meta h4 {{ margin: 0 0 8px 0; font-size: 15px; color: #1976d2; word-break: break-all; }}
    .meta p {{ margin: 4px 0; }}
    .badge {{ display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 11px; }}
    .badge.aprovado {{ background: #e8f5e9; color: #2e7d32; }}
    .badge.pendente {{ background: #fff3e0; color: #e65100; }}
    .badge.revisao-humana {{ background: #ffebee; color: #c62828; }}
  </style>
</head>
<body>
  <h1>Folha de Contato — Recortes de Figuras</h1>
  <p class="sub">Prova: <strong>{prova_id}</strong> | Total de figuras no manifesto: <strong>{len(figuras)}</strong></p>
  <div class="grid">
    {''.join(cards)}
  </div>
</body>
</html>"""

    html_path.write_text(html_content, encoding="utf-8")
    return html_path


def main() -> None:
    ap = argparse.ArgumentParser(description="Recorta figuras a partir do manifesto da prova.")
    ap.add_argument("prova_id", help="ID da prova (ex.: 2025-prova1)")
    ap.add_argument("--paginas", type=int, nargs="*", help="Páginas específicas a recortar")
    args = ap.parse_args()

    base = RAIZ / "content" / "provas" / args.prova_id
    prova_file = base / "prova.json"
    manifesto_file = base / "figuras.manifest.json"

    if not prova_file.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {prova_file}")
    if not manifesto_file.exists():
        raise FileNotFoundError(f"Manifesto não encontrado: {manifesto_file}")

    prova = json.loads(prova_file.read_text("utf-8"))
    manifesto = json.loads(manifesto_file.read_text("utf-8"))

    destino = RAIZ / "public" / "figuras" / args.prova_id
    destino.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(RAIZ / prova["arquivoProva"])
    recortadas = 0

    for item in manifesto.get("figuras", []):
        if args.paginas and item["pagina"] not in args.paginas:
            continue
        pagina = doc[item["pagina"] - 1]
        dpi = item.get("dpi", 220)
        pix = pagina.get_pixmap(clip=fitz.Rect(item["bbox"]), dpi=dpi, alpha=False)
        img = aparar(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
        out_file = destino / item["arquivo"]
        img.save(out_file, "WEBP", quality=90, method=6)
        recortadas += 1
        print(f"ok {item['arquivo']} {img.width}x{img.height} (p.{item['pagina']})")

    doc.close()

    # Gera folha de contato com todas as figuras do manifesto
    folha = gerar_folha_contato(args.prova_id, manifesto.get("figuras", []), destino)
    print(f"[{args.prova_id}] Recorte finalizado: {recortadas} figuras processadas. Folha de contato: {folha}")


if __name__ == "__main__":
    main()
