from fractions import Fraction
from itertools import product

# Cada marmita tem exatamente um ingrediente de cada grupo, escolhido com a mesma chance.
grupos = {
    "carboidrato": ["arroz", "macarrão", "batata"],
    "proteína": ["frango", "carne", "ovo"],
    "folha": ["alface", "rúcula"],
    "grão": ["feijão", "lentilha"],
    "legume": ["chuchu", "cenoura"],
}

espaco = list(product(*grupos.values()))
total = len(espaco)
print("Total de marmitas possíveis:", total)


def prob(evento):
    favoraveis = sum(1 for m in espaco if evento(m))
    return Fraction(favoraveis, total)


com_ovo = lambda m: m[1] == "ovo"
sem_ovo = lambda m: m[1] != "ovo"
com_feijao = lambda m: m[3] == "feijão"
sem_feijao = lambda m: m[3] != "feijão"

eventos = {
    "A (com ovo e com feijão)": lambda m: com_ovo(m) and com_feijao(m),
    "B (sem ovo e sem feijão)": lambda m: sem_ovo(m) and sem_feijao(m),
    "C (sem ovo e com feijão)": lambda m: sem_ovo(m) and com_feijao(m),
    "D (com ovo e sem feijão)": lambda m: com_ovo(m) and sem_feijao(m),
}
for nome, ev in eventos.items():
    p = prob(ev)
    print(f"{nome}: {p}")

print("Esperado no texto: A = 1/3, B = 1/2, C = 2/3, D = 1/6")
