# Conferência numérica da Questão 8 (tabela do Relatório Analítico da AP, Estágio).
# Valores impressos na tabela do texto-base tb-07-08: {categoria: {período: (quantidade, percentual)}}.

tabela = {
    "planejamento": {"1": (43074, 91.7), "2": (31385, 91.9)},
    "regencia": {"1": (41019, 87.3), "2": (29780, 87.2)},
    "desigualdades": {"1": (22844, 48.6), "2": (16534, 48.4)},
    "violencia": {"1": (20784, 44.3), "2": (15654, 45.8)},
}

for periodo in ("1", "2"):
    print(f"periodo {periodo} - total implícito (quantidade / percentual):")
    totais = []
    for categoria, valores in tabela.items():
        quantidade, percentual = valores[periodo]
        total = quantidade / (percentual / 100)
        totais.append(total)
        print(f"  {categoria:14s} {quantidade:>6d} / {percentual:5.1f}% -> {total:>10.0f}")
    print(f"  intervalo dos totais implícitos: {min(totais):.0f} a {max(totais):.0f}")

# Discrepância: planejamento/regência (acima de 85%) x desigualdades/violência (abaixo de 50%).
for periodo in ("1", "2"):
    alto = min(tabela["planejamento"][periodo][1], tabela["regencia"][periodo][1])
    baixo = max(tabela["desigualdades"][periodo][1], tabela["violencia"][periodo][1])
    print(f"periodo {periodo}: menor percentual alto = {alto}% | maior percentual baixo = {baixo}% | diferença = {alto - baixo:.1f} p.p.")
    assert alto > 85 and baixo < 50, "a discrepância descrita na questão não se confirma"
print("discrepância confirmada nos dois períodos")
