"""
Verificação algébrica e geométrica da Questão 47 do ENADE 2025 (Prova 1).
Resolve o sistema 3x2, calcula os vetores normais dos planos e o vetor diretor da reta.
"""

import sympy as sp

C1, C2, M = sp.symbols('C1 C2 M', real=True)

# Equações dos dois planos:
# pi_1: C1 + C2 + M - 41000 = 0
# pi_2: C1 + 2M - 28000 = 0
eq1 = sp.Eq(C1 + C2 + M, 41000)
eq2 = sp.Eq(C1 + 2*M, 28000)

# Solução do sistema em função de M (parâmetro livre / 1 grau de liberdade)
sol = sp.solve([eq1, eq2], (C1, C2))
print("Solução paramétrica do sistema:")
print(f"C1 = {sol[C1]}")
print(f"C2 = {sol[C2]}")
print("M = M (variável livre)")

# Vetores normais dos dois planos:
n1 = sp.Matrix([1, 1, 1])
n2 = sp.Matrix([1, 0, 2])

# Vetor diretor da reta de interseção (produto vetorial dos normais):
v_dir = n1.cross(n2)
print(f"\nVetor diretor da reta de interseção (n1 x n2): {list(v_dir)}")
assert v_dir.norm() != 0, "Planos seriam paralelos ou coincidentes!"

print("Como v_dir != 0, os planos são secantes e a interseção é uma reta.")
print("Um sistema cuja solução geométrica é uma reta possui infinitas soluções (SPI).")
print("Portanto, NÃO é possível determinar preços únicos (Alternativa A).")
