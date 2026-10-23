from fractions import Fraction

# Alternativa A: placa que começa com DOM; posições livres multiplicadas (princípio multiplicativo).
letras_livres = 26          # quarta letra (as três primeiras são D, O, M)
numeros = 10 ** 3           # três números
total_A = letras_livres * numeros
print(f"A: 26 x 10^3 = {total_A} placas")

# Alternativa B: subtração (total menos os casos com números iguais) -> princípio da subtração.
print(f"B: 3357 - 1091 = {3357 - 1091}")

# Alternativa C: soma de casos disjuntos (placas com 11 e com 22).
print(f"C: 825 + 127 = {825 + 127}")

# Alternativa D: divisão pelo número de ordenações (permutações das letras).
print(f"D: 156000 / 6 = {Fraction(156000, 6)}")
