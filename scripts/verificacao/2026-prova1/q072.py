from math import sqrt

A = (-2.0, 0.0)
B = (2.0, 0.0)
c = abs(B[0] - A[0]) / 2          # distância focal = 2c = 4
a = 1.0                            # vértices (±1, 0) lidos na Figura 2
b2 = c**2 - a**2                   # b² = c² - a² = 3
print(f"c = {c}, a = {a}, b² = {b2}")
print("equação: x² - y²/", b2, "= 1")

def dist(p, q):
    return sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2)

P = (-2.0, 3.0)
Q = (2.7, sqrt(3 * (2.7**2 - 1)))  # ponto da curva com x = 2,7
for nome, X in [("P", P), ("Q", Q)]:
    on_curve = abs(X[0] ** 2 - X[1] ** 2 / 3 - 1) < 1e-9
    d = abs(dist(X, B) - dist(X, A))
    print(f"{nome}={tuple(round(v, 3) for v in X)} sobre a curva: {on_curve} | |XB - XA| = {d:.3f}")
print("distância focal 2c =", 2 * c, "| diferença absoluta = 2a =", 2 * a)
print("2a < 2c:", 2 * a < 2 * c)
print("eq. com 2^2 (alternativas A e D) satisfaz P?", abs(P[0] ** 2 / 4 - P[1] ** 2 / 4 - 1) < 1e-9)
