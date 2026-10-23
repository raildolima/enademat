import argparse
import json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parents[2]


def adicionar_grade(img: Image.Image, largura_pt: float, altura_pt: float, dpi: int = 110) -> Image.Image:
    escala = dpi / 72.0
    grade_img = img.copy().convert("RGB")
    draw = ImageDraw.Draw(grade_img)

    # Tenta obter fonte padrão pequena
    try:
        fonte = ImageFont.load_default()
    except Exception:
        fonte = None

    # Linhas verticais
    x_pt = 0.0
    while x_pt <= largura_pt:
        x_px = int(x_pt * escala)
        cor = (150, 150, 150) if int(x_pt) % 100 == 0 else (215, 215, 215)
        draw.line([(x_px, 0), (x_px, grade_img.height)], fill=cor, width=1)
        if int(x_pt) % 100 == 0 and x_px + 2 < grade_img.width:
            draw.text((x_px + 2, 4), f"{int(x_pt)}", fill=(60, 60, 60), font=fonte)
        x_pt += 50.0

    # Linhas horizontais
    y_pt = 0.0
    while y_pt <= altura_pt:
        y_px = int(y_pt * escala)
        cor = (150, 150, 150) if int(y_pt) % 100 == 0 else (215, 215, 215)
        draw.line([(0, y_px), (grade_img.width, y_px)], fill=cor, width=1)
        if int(y_pt) % 100 == 0 and y_px + 2 < grade_img.height:
            draw.text((4, y_px + 2), f"{int(y_pt)}", fill=(60, 60, 60), font=fonte)
        y_pt += 50.0

    return grade_img


def renderizar_prova(prova_id: str, paginas_alvo=None, dpi: int = 110) -> None:
    prova_path = RAIZ / "content" / "provas" / prova_id / "prova.json"
    if not prova_path.exists():
        raise FileNotFoundError(f"Arquivo prova.json não encontrado: {prova_path}")

    with open(prova_path, "r", encoding="utf-8") as f:
        prova_meta = json.load(f)

    pdf_path = RAIZ / prova_meta["arquivoProva"]
    doc = fitz.open(pdf_path)

    dir_limpas = RAIZ / "work" / "paginas" / prova_id
    dir_grade = RAIZ / "work" / "paginas-grade" / prova_id
    dir_limpas.mkdir(parents=True, exist_ok=True)
    dir_grade.mkdir(parents=True, exist_ok=True)

    zoom = dpi / 72.0
    matriz = fitz.Matrix(zoom, zoom)

    paginas_processadas = 0
    for idx, page in enumerate(doc):
        num_pag = idx + 1
        if paginas_alvo and num_pag not in paginas_alvo:
            continue

        # Renderiza via PyMuPDF
        pix = page.get_pixmap(matrix=matriz, alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        # Salva imagem limpa
        limpa_file = dir_limpas / f"p{num_pag:03d}.png"
        img.save(limpa_file, "PNG", optimize=True)

        # Gera e salva imagem com grade
        img_grade = adicionar_grade(img, page.rect.width, page.rect.height, dpi=dpi)
        grade_file = dir_grade / f"p{num_pag:03d}.png"
        img_grade.save(grade_file, "PNG", optimize=True)

        paginas_processadas += 1

    doc.close()
    print(f"[{prova_id}] Renderização concluída: {paginas_processadas} páginas salvas em work/paginas e work/paginas-grade.")


def main():
    parser = argparse.ArgumentParser(description="Renderiza páginas de uma prova em PNG com e sem grade.")
    parser.add_argument("prova_id", nargs="?", help="ID da prova ou 'todas'")
    parser.add_argument("--paginas", type=int, nargs="*", help="Lista de números de páginas específicas a renderizar")
    parser.add_argument("--dpi", type=int, default=110, help="DPI da renderização (padrão: 110)")
    args = parser.parse_args()

    provas = ["2021-licenciatura", "2025-prova1", "2025-prova5", "2026-prova1"]
    if args.prova_id and args.prova_id != "todas":
        provas = [args.prova_id]

    for p in provas:
        renderizar_prova(p, paginas_alvo=args.paginas, dpi=args.dpi)


if __name__ == "__main__":
    main()
