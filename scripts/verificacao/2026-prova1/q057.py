import sympy as sp

a1, a2, d1, d2 = sp.symbols("a1 a2 d1 d2", real=True)
A = sp.Matrix([a1, a2])
D = sp.Matrix([d1, d2])

# P centralizado entre A e D: ponto médio do segmento AD
P = (A + D) / 2
AP = P - A
DP = P - D
zero = sp.zeros(2, 1)

testes = {
    "A": sp.simplify(AP + DP) == zero,        # AP = -DP
    "B": sp.simplify(AP - DP) == zero,        # AP = DP
    "C": sp.simplify(AP - DP / 2) == zero,    # AP = 1/2 DP
    "D": sp.simplify(AP + DP / 2) == zero,    # AP = -1/2 DP
}
print("AP =", sp.simplify(AP).T, "| DP =", sp.simplify(DP).T)
print("alternativas válidas para o ponto médio:", [k for k, v in testes.items() if v])

# Exemplo numérico com os pontos da Questão 58: A=(-3,-6), D=(5,10), P=(1,2)
Anum = sp.Matrix([-3, -6])
Dnum = sp.Matrix([5, 10])
Pnum = (Anum + Dnum) / 2
print("P médio numérico =", Pnum.T, "| AP =", (Pnum - Anum).T, "| -DP =", (-(Pnum - Dnum)).T)
