from fractions import Fraction
from statistics import mean, median

tabela = {
    "A": ("0,85", "0,30"), "B": ("1,10", "0,45"), "C": ("0,95", "0,50"),
    "D": ("1,20", "0,40"), "E": ("0,80", "0,25"),
}
dec = lambda s: Fraction(s.replace(",", "."))
reducoes = {p: dec(i) - dec(a) for p, (i, a) in tabela.items()}
valores = list(reducoes.values())
print("reduções:", {p: str(v) for p, v in reducoes.items()})
print("média:", mean(valores), "| mediana:", median(valores))
print("maior redução no ponto:", max(reducoes, key=reducoes.get))
