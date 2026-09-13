"""
Verificação algébrica da Questão 51 do ENADE 2025 (Prova 1).
Compara a fórmula de Al-Khwarizmi com a fórmula canônica de Bhaskara para x^2 + bx = c.
"""

import sympy as sp

x, b, c = sp.symbols('x b c', positive=True)

# Fórmula de Al-Khwarizmi descrita no texto-base:
# 1. Metade das raízes: b/2
# 2. Ao quadrado: (b/2)^2 = b^2/4
# 3. Adiciona a c: b^2/4 + c
# 4. Raiz quadrada: sqrt(b^2/4 + c)
# 5. Subtrai metade das raízes: sqrt(b^2/4 + c) - b/2
sol_alkhwarizmi = sp.sqrt(b**2 / 4 + c) - b / 2

# Fórmula canônica de Bhaskara para x^2 + bx - c = 0:
sol_bhaskara = (-b + sp.sqrt(b**2 - 4*1*(-c))) / (2*1)

print("Expressão de Al-Khwarizmi:")
sp.pprint(sol_alkhwarizmi)

print("\nExpressão de Bhaskara:")
sp.pprint(sol_bhaskara)

# Verificação de equivalência algébrica:
diferenca = sp.simplify(sol_alkhwarizmi - sol_bhaskara)
print(f"\nDiferença simplificada: {diferenca}")
assert diferenca == 0, "As fórmulas devem ser algebricamente idênticas para a raiz positiva!"

# Teste numérico com b = 10 e c = 39:
val_al = sol_alkhwarizmi.subs({b: 10, c: 39})
val_bh = sol_bhaskara.subs({b: 10, c: 39})
print(f"\nPara b = 10, c = 39:")
print(f"Al-Khwarizmi: x = {val_al}")
print(f"Bhaskara:     x = {val_bh}")
assert val_al == val_bh == 3

print("\nConclusão: a expressão correta é x = sqrt(b^2/4 + c) - b/2 (Alternativa A).")
