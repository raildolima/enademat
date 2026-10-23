from fractions import Fraction

FOLHETOS, CARTOES, DIAS = 3015, 1005, 3

# Decomposição de 3 015 = 3 000 + 15
print("decomposição: 3000/3 + 15/3 =", Fraction(3000, 3) + Fraction(15, 3))
print("folhetos por dia:", FOLHETOS // DIAS, "resto", FOLHETOS % DIAS)
print("cartões por dia:", CARTOES // DIAS, "resto", CARTOES % DIAS)

estudantes = {1: (1005, 305), 2: (1015, 315), 3: (1005, 335)}
for n, (f, c) in estudantes.items():
    ok_f = f * DIAS == FOLHETOS
    ok_c = c * DIAS == CARTOES
    print(f"estudante {n}: folhetos {f} (x3 = {f * DIAS}, {'correto' if ok_f else 'incorreto'}); "
          f"cartões {c} (x3 = {c * DIAS}, {'correto' if ok_c else 'incorreto'})")

acertos_folhetos = [n for n, (f, _) in estudantes.items() if f * DIAS == FOLHETOS]
acertos_cartoes = [n for n, (_, c) in estudantes.items() if c * DIAS == CARTOES]
print("acertaram folhetos:", acertos_folhetos, "| acertaram cartões:", acertos_cartoes)
