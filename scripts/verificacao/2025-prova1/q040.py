"""
Verificação geométrica e analítica da Questão 40 do ENADE 2025 (Prova 1).
Calcula o produto vetorial entre u e v, seu módulo e a área do paralelogramo.
"""

import sympy as sp

u = sp.Matrix([2, 1, 0])
v = sp.Matrix([-1, 3, 0])

# Produto vetorial u x v
u_cross_v = u.cross(v)
print(f"u = {list(u)}")
print(f"v = {list(v)}")
print(f"u x v = {list(u_cross_v)}")

# Módulo do produto vetorial (área do paralelogramo)
area = u_cross_v.norm()
print(f"Área do paralelogramo (||u x v||) = {area}")
assert area == 7, "Erro: área deve ser 7!"

# Produto escalar u . v (para testar ortogonalidade)
dot_prod = u.dot(v)
print(f"Produto escalar u . v = {dot_prod}")
print(f"São ortogonais? {dot_prod == 0} (portanto não formam retângulo direto)")

# Teste de paralelismo (se fossem paralelos, cross seria 0)
print(f"São paralelos? {u_cross_v.norm() == 0}")

print("\nConclusão da questão: Área é 7 (Alternativa A).")
