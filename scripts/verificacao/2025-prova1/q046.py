"""
Verificação algébrica da Questão 46 do ENADE 2025 (Prova 1).
Resolve o sistema linear do problema de Cury e Bisognin e analisa a classificação.
"""

import sympy as sp

C, M = sp.symbols('C M', real=True)

# Sistema:
# 2C + M = 41000
# C + 2M = 28000
eq1 = sp.Eq(2*C + M, 41000)
eq2 = sp.Eq(C + 2*M, 28000)

solucao = sp.solve([eq1, eq2], (C, M))
valor_C = solucao[C]
valor_M = solucao[M]
diferenca = valor_C - valor_M

print(f"Valor do carro (C): R$ {valor_C:.2f}")
print(f"Valor da moto (M): R$ {valor_M:.2f}")
print(f"Diferença entre o valor do carro e o da moto (C - M): R$ {diferenca:.2f}")

# O estudante encontrou C = 18000 e M = 5000 corretamente.
# Porém, marcou o valor de C (18000, alternativa c) e não a diferença (13000, alternativa b).
# Classificação segundo Cury e Bisognin:
# Categoria B: 'identificou que o problema poderia ser modelado por um sistema de duas equações
# lineares com duas incógnitas, corretamente expressas, resolveu o sistema, mas errou alguns detalhes
# e não apresentou a resposta correta.'
print("\nEnquadramento: Categoria B (Alternativa B).")
