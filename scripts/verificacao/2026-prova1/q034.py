# Decomposição de 108 no sistema de base 6 (valor posicional) e em base 8.
numero = 108

ordens = []
resto = numero
for potencia in (36, 6, 1):
    ordens.append(resto // potencia)
    resto %= potencia
print(f"108 = {ordens[0]}·6² + {ordens[1]}·6 + {ordens[2]}  (base 6: {''.join(map(str, ordens))})")
print("Conferência:", ordens[0] * 36 + ordens[1] * 6 + ordens[2] == numero)
print("108 em base 8 (valor de 044):", int("044", 8))
