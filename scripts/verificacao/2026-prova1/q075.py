from fractions import Fraction
from itertools import product

motorizacoes = ["elétrica", "bicombustível", "híbrida"]
potencias = [75, 100, 125, 150, 210]
modelos = ["hatch", "sedan", "picape", "SUV"]
cores = ["preto", "branco", "cinza", "vermelho", "grafite", "prata"]

espaco = list(product(motorizacoes, potencias, modelos, cores))
total = len(espaco)
print("total de carros possíveis =", total, "=", len(motorizacoes), "·", len(potencias), "·", len(modelos), "·", len(cores))

favoraveis = [
    c for c in espaco
    if c[0] in ("elétrica", "híbrida")   # admite eletricidade
    and c[1] > 120                       # potência superior a 120 HP
    and c[2] == "SUV"
    and c[3] != "vermelho"
]
print("casos favoráveis =", len(favoraveis))
p = Fraction(len(favoraveis), total)
print("probabilidade =", p, "=", float(p))
alternativas = {"A": Fraction(1, 60), "B": Fraction(1, 18), "C": Fraction(1, 12), "D": Fraction(1, 3)}
print("coincidem:", [k for k, v in alternativas.items() if v == p])
