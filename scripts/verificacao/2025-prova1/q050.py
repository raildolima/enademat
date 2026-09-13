"""
Verificação geométrica da Questão 50 do ENADE 2025 (Prova 1).
Modela a técnica de completar quadrados de Al-Khwarizmi para x^2 + 10x = 39.
"""

import sympy as sp

x = sp.Symbol('x', positive=True)

# No modelo da cruz com 4 retângulos simétricos em torno do quadrado x^2:
# x^2 + 4 * (largura * x) = x^2 + 10x  =>  4 * largura = 10  =>  largura = 10/4 = 5/2.
largura_retangulo = sp.Rational(5, 2)
area_amarela = 4 * (largura_retangulo * x)
print(f"Área dos 4 retângulos laterais (amarelos): 4 * ({largura_retangulo} * x) = {area_amarela}")
assert area_amarela == 10*x, "Área amarela deve ser exatamente 10x!"

# Para completar o quadrado grande, preenchem-se os 4 cantos (azuis) de dimensões (5/2) x (5/2):
area_cantos_azuis = 4 * (largura_retangulo ** 2)
print(f"Área dos 4 cantos para completar o quadrado (azuis): 4 * ({largura_retangulo})^2 = {area_cantos_azuis}")
assert area_cantos_azuis == 25, "Área azul adicionada deve ser exatamente 25!"

# Área total do quadrado grande:
lado_quadrado_grande = x + 2 * largura_retangulo
area_quadrado_grande = lado_quadrado_grande ** 2
print(f"Lado do quadrado grande: x + 2*(5/2) = {lado_quadrado_grande}")
print(f"Área do quadrado grande: (x + 5)^2 = {sp.expand(area_quadrado_grande)}")

# Como x^2 + 10x = 39, temos:
# (x + 5)^2 = 39 + 25 = 64  =>  x + 5 = 8  =>  x = 3.
solucao = sp.solve(sp.Eq(area_quadrado_grande, 39 + 25), x)
print(f"Solução positiva: x = {solucao[0]}")
assert solucao[0] == 3, "x deve ser 3!"

print("\nConclusão: a largura dos retângulos é 5/2 (Alternativa C).")
