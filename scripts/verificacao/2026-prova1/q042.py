import math
import sympy as sp

r, n = sp.symbols("r n", positive=True)
l = 2 * r * sp.sin(sp.pi / n)          # lado do polígono regular inscrito de n lados
perimetro = n * l                      # 2p
apotema = r * sp.cos(sp.pi / n)        # distância do centro ao lado

# Limite do perímetro (comprimento da circunferência) quando n -> ∞
lim_perimetro = sp.limit(perimetro.subs(r, 1), n, sp.oo)
print("lim n·l (r=1) =", lim_perimetro, "= 2π? ", sp.simplify(lim_perimetro - 2 * sp.pi) == 0)
# Área do polígono: (perímetro · apótema) / 2 -> área do círculo
area = perimetro * apotema / 2
lim_area = sp.limit(area.subs(r, 1), n, sp.oo)
print("lim área (r=1) =", lim_area, "= π? ", sp.simplify(lim_area - sp.pi) == 0)
# Checagem numérica do apótema: n = 12, r = 1 -> r cos(π/12)
print("apótema n=12, r=1 numérico:", round(float(apotema.subs({r: 1, n: 12})), 5), "vs cos(pi/12) =", round(math.cos(math.pi / 12), 5))
# Alternativas: lim n·l/2 dá π r, não 2π r (falsa); apótema com seno (C, D) falha
print("n·l/2 limite (r=1):", sp.limit((perimetro / 2).subs(r, 1), n, sp.oo))
print("apótema com seno em n=12 (r=1):", round(math.sin(math.pi / 12), 5), "!= apótema correto")
