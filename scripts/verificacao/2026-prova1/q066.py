import sympy as sp

T = sp.Matrix([[0, -1], [1, 0]])                     # T(x, y) = (-y, x)
print("matriz de T na base canônica:", T.tolist())
print("T(1,0) =", list(T * sp.Matrix([1, 0])), "| T(0,1) =", list(T * sp.Matrix([0, 1])))

# Vértices de ABC lidos na figura (aprox.): A=(0,2), B=(0,1), C=(1,2)
pontos = [sp.Matrix([0, 2]), sp.Matrix([0, 1]), sp.Matrix([1, 2])]

# Leitura aproximada de A', B', C' em cada gráfico
lidos = {
    "I":   [(2, 0), (1, 0), (2, -1)],
    "II":  [(-2, 0), (-1, 0), (-2, 1)],
    "III": [(2, 0), (1, 0), (2, 1)],
    "IV":  [(0, -2), (0, -1), (1, -2)],
}
# Transformações candidatas
candidatas = {
    "rotação 90° horária":           sp.Matrix([[0, 1], [-1, 0]]),
    "rotação 90° anti-horária (T)":  T,
    "reflexão em y = x":             sp.Matrix([[0, 1], [1, 0]]),
    "reflexão em y = 0":             sp.Matrix([[1, 0], [0, -1]]),
}
for fig, val in lidos.items():
    for nome, M in candidatas.items():
        imagens = [tuple(M * p) for p in pontos]
        if all(abs(float(a) - x) < 0.5 and abs(float(b) - y) < 0.5 for (a, b), (x, y) in zip(imagens, val)):
            print(f"figura {fig}: compatível com {nome}")
