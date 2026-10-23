from math import prod

# Um ingrediente de cada grupo: carboidratos, proteínas, folhas, grãos, legumes
grupos = {"carboidratos": 3, "proteinas": 3, "folhas": 2, "graos": 2, "legumes": 2}
escolhas = list(grupos.values())
total = prod(escolhas)
print(f"escolhas por grupo={escolhas} | marmitas distintas={total}")
# Princípio Fundamental da Contagem: cada escolha sucessiva multiplica o número de caminhos
parcial = 1
for nome, k in grupos.items():
    parcial *= k
    print(f"após {nome}: {parcial} caminhos acumulados")
