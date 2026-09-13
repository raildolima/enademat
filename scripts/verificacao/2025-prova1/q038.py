"""
Verificação geométrica e trigonométrica da Questão 38 do ENADE 2025 (Prova 1).
Mostra a dedução da altura pelo teodolito com distância no solo e ângulo de elevação.
"""

import sympy as sp

theta, d, h = sp.symbols('theta d h', positive=True)

# No triângulo retângulo formado pela árvore (vertical, cateto oposto h)
# e pela distância medida no solo (horizontal, cateto adjacente d):
# tg(theta) = h / d  =>  h = d * tg(theta)
h_tangente = d * sp.tan(theta)

# Se usasse seno:
# sen(theta) = h / hipotenusa  =>  h = hipotenusa * sen(theta)
# Mas a distância medida foi do ponto no solo até a base da árvore (cateto adjacente d),
# e não a linha de visada (hipotenusa).
print(f"Relação correta com cateto adjacente d: h = d * tan(theta) = {h_tangente}")
print("Portanto, deve-se usar a tangente do ângulo (Alternativa A).")
