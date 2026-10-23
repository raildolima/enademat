from fractions import Fraction

tabela = {11: 1, 12: 7, 13: 23, 14: 40, 15: 53, 16: 41, 17: 35}
n = sum(tabela.values())

media = Fraction(sum(h * f for h, f in tabela.items()), n)
print(f"n={n} | soma dos produtos={sum(h * f for h, f in tabela.items())} | média={media} g/dL -> A (média em [12, 14])? {12 <= media <= 14}")

acum_14 = sum(f for h, f in tabela.items() if h <= 14)
print(f"B: freq. absoluta com hemoglobina <= 14: {acum_14} -> >= 70? {acum_14 >= 70}")

freq_16 = Fraction(tabela[16], n) * 100
print(f"C: freq. relativa de 16 g/dL: {float(freq_16):.1f}% | 64% de 200 = {Fraction(64, 100) * 200} -> 64%? {freq_16 == 64}")

valores = sorted(h for h, f in tabela.items() for _ in range(f))
mediana = Fraction(valores[n // 2 - 1] + valores[n // 2], 2)
print(f"D: mediana dos valores de hemoglobina = {mediana} g/dL")
percentuais = sorted(Fraction(f, n) * 100 for f in tabela.values())
mediana_pct = Fraction(percentuais[3])
print(f"D: mediana da lista de percentuais (7 valores) = {float(mediana_pct):.1f}% -> 20%? {mediana_pct == 20}")
