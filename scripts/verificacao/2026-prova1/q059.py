# Geoplano retangular: 6 linhas x 9 colunas de pontos (Figura 1), espacamento unitario.
# Geoplano isometrico: malha triangular (Figura 2); distancia^2 entre (a,b) e (c,d) = u^2 + u*v + v^2, com u=a-c, v=b-d.
from itertools import combinations

def d2_retangular(p, q):
    return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2

def d2_isometrico(p, q):
    u, v = p[0] - q[0], p[1] - q[1]
    return u * u + u * v + v * v

def colinear_retangular(p, q, r):
    return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) == 0

def colinear_isometrico(p, q, r):
    # produto vetorial no sistema de coordenadas oblíquo (base com angulo de 60 graus): determinante proporcional
    # basta checar o determinante das coordenadas (a,b): zero <=> colineares
    return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) == 0

def tipos(pontos, d2, colin):
    contagem = {"equilatero": 0, "isosceles": 0, "escaleno": 0}
    exemplo = {}
    for p, q, r in combinations(pontos, 3):
        if colin(p, q, r):
            continue
        lados = sorted([d2(p, q), d2(q, r), d2(p, r)])
        if lados[0] == lados[1] == lados[2]:
            t = "equilatero"
        elif lados[0] == lados[1] or lados[1] == lados[2]:
            t = "isosceles"
        else:
            t = "escaleno"
        contagem[t] += 1
        exemplo.setdefault(t, (p, q, r, lados))
    return contagem, exemplo

retangular = [(i, j) for i in range(9) for j in range(6)]
isometrico = [(a, b) for a in range(6) for b in range(6)]

cr, er = tipos(retangular, d2_retangular, colinear_retangular)
ci, ei = tipos(isometrico, d2_isometrico, colinear_isometrico)
print("retangular:", cr)
print("  exemplo escaleno (vertices, quadrados dos lados):", er.get("escaleno"))
print("isometrico:", ci)
print("  exemplo escaleno (vertices, quadrados dos lados):", ei.get("escaleno"))

momento = {1: "isosceles", 2: "equilatero", 3: "escaleno"}
def permite(contagem, m):
    return contagem[momento[m]] > 0
for nome, c in [("retangular", cr), ("isometrico", ci)]:
    print(nome, {m: permite(c, m) for m in (1, 2, 3)})

alternativas = {
    "A": ("isometrico", "inviabiliza", 2),
    "B": ("retangular", "inviabiliza", 3),
    "C": ("retangular", "permite", (1, 2, 3)),
    "D": ("isometrico", "permite", (1, 2, 3)),
}
resultado = {}
for k, (geo, acao, mom) in alternativas.items():
    c = cr if geo == "retangular" else ci
    if acao == "inviabiliza":
        resultado[k] = not permite(c, mom)
    else:
        resultado[k] = all(permite(c, m) for m in mom)
print("alternativas verdadeiras:", [k for k, v in resultado.items() if v])
