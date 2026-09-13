"""
Verificação trigonométrica da Questão 48 do ENADE 2025 (Prova 1).
Testa os pontos notáveis marcados no gráfico do GeoGebra para f(x) = sen(x) + cos(x)
versus a alternativa f(x) = cos(x) - sen(x).
"""

import sympy as sp

x = sp.Symbol('x', real=True)

# Função da Alternativa D:
f_D = sp.sin(x) + sp.cos(x)

# Função da Alternativa A:
f_A = sp.cos(x) - sp.sin(x)

pontos_grafico = [
    (0, 1),
    (sp.pi / 2, 1),
    (sp.pi, -1)
]

print("=== Teste da Alternativa D: f(x) = sen(x) + cos(x) ===")
for p_x, p_y in pontos_grafico:
    val = f_D.subs(x, p_x)
    print(f"x = {p_x} -> f_D(x) = {val} | Esperado pelo gráfico: {p_y} -> Correto? {val == p_y}")

# Teste do ponto de máximo:
ponto_critico = sp.pi / 4
val_max = f_D.subs(x, ponto_critico)
print(f"Ponto crítico x = pi/4 -> f_D(pi/4) = {val_max} = {float(val_max):.4f} (máximo relativo)")

print("\n=== Teste da Alternativa A: f(x) = cos(x) - sen(x) ===")
for p_x, p_y in pontos_grafico:
    val = f_A.subs(x, p_x)
    print(f"x = {p_x} -> f_A(x) = {val} | Esperado pelo gráfico: {p_y} -> Correto? {val == p_y}")

print("\nConclusão: apenas a Alternativa D satisfaz todos os pontos do gráfico do GeoGebra.")
