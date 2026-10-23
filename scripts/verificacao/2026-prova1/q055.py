from fractions import Fraction

n = 200
tabela = {11: 1, 12: 7, 13: 23, 14: 40, 15: 53, 16: 41, 17: 35}
assert sum(tabela.values()) == n

print("h | f_abs | f_rel | percentual | denominador do percentual")
for h, f in tabela.items():
    fr = Fraction(f, n)
    pct = fr * 100
    print(f"{h} | {f} | {fr} | {float(pct):.2f}% | {pct.denominator}")

print("constante f_rel = f_abs * (1/n):", Fraction(1, n), "| em percentual, 100/n:", Fraction(100, n))

# A: percentuais com decimal exato (denominador 1, 2, 4, 5, 10, 20... nunca dízima)
print("todos os percentuais são decimais exatos:",
      all((Fraction(f, n) * 100).denominator in (1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 200) for f in tabela.values()))

# B: a mesma contagem numa população menor muda a frequência relativa
print("B: f_rel de 1 pessoa com n=200:", Fraction(1, 200), "| com n=100:", Fraction(1, 100))

# C: com n=100 o percentual é sempre inteiro (100/100 = 1), mas a afirmação é de exclusividade
print("C: percentual com n=100 de f=7:", Fraction(7, 100) * 100, "| com n=200 de f=2:", Fraction(2, 200) * 100)
