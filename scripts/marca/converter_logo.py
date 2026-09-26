"""Converte a assinatura horizontal da UFMS (PNG do Design System) para WebP em public/marca/.

Uso: .venv\\Scripts\\python scripts/marca/converter_logo.py

Mantém a proporção original (manual da UFMS: nunca distorcer) e gera 2x a maior altura exibida no app (60 px no rodapé).
"""

from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
ORIGEM = RAIZ / "UFMS - Design" / "assets" / "logos"
DESTINO = RAIZ / "public" / "marca"
ALTURA_PX = 120
VERSOES = ("positivo", "negativo")


def converter(versao: str, origem: Path = ORIGEM, destino: Path = DESTINO, altura: int = ALTURA_PX) -> Path:
    imagem = Image.open(origem / f"ufms_assinatura_horizontal_{versao}.png").convert("RGBA")
    largura = round(imagem.width * altura / imagem.height)
    destino.mkdir(parents=True, exist_ok=True)
    saida = destino / f"ufms-assinatura-horizontal-{versao}.webp"
    imagem.resize((largura, altura), Image.LANCZOS).save(saida, "WEBP", quality=92, method=6)
    return saida


if __name__ == "__main__":
    for versao in VERSOES:
        saida = converter(versao)
        with Image.open(saida) as im:
            print(f"{saida.relative_to(RAIZ)}: {im.width}x{im.height}, {saida.stat().st_size} bytes")
