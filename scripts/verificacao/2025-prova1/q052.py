"""
Verificação da matemática das odds e Educação Financeira Crítica na Questão 52 do ENADE 2025 (Prova 1).
Calcula as probabilidades implícitas, o overround da casa de apostas e o retorno do apostador.
"""

odds_vasco = 4.41
odds_empate = 3.74
odds_palmeiras = 1.79

# Probabilidades implícitas (1 / odd):
p_vasco = 1.0 / odds_vasco
p_empate = 1.0 / odds_empate
p_palmeiras = 1.0 / odds_palmeiras

soma_probabilidades = p_vasco + p_empate + p_palmeiras

print(f"Probabilidade implícita Vasco:     {p_vasco*100:.2f}% (dado na prova: 22,68%)")
print(f"Probabilidade implícita Empate:    {p_empate*100:.2f}% (dado na prova: 26,74%)")
print(f"Probabilidade implícita Palmeiras: {p_palmeiras*100:.2f}% (dado na prova: 55,86%)")
print(f"Soma total das probabilidades implícitas: {soma_probabilidades*100:.2f}%")

# Overround da casa de apostas:
overround = (soma_probabilidades - 1.0) * 100.0
lucro_casa = (1.0 - (1.0 / soma_probabilidades)) * 100.0

print(f"Overround (margem inflacionada): {overround:.2f}%")
print(f"Ganho da casa sobre o total apostado: {lucro_casa:.2f}% (aproximadamente 5%)")

# Simulação de aposta proporcional de R$ 105,28:
# Apostar R$ 22,68 no Vasco -> retorno se Vasco vencer: 22,68 * 4,41 = R$ 100,02
# Apostar R$ 26,74 no Empate -> retorno se der Empate: 26,74 * 3,74 = R$ 100,01
# Apostar R$ 55,86 no Palmeiras -> retorno se Palmeiras vencer: 55,86 * 1,79 = R$ 99,99
total_apostado = 22.68 + 26.74 + 55.86
retorno_garantido = 100.0
perda_apostador = total_apostado - retorno_garantido
perc_perda = (perda_apostador / total_apostado) * 100.0

print(f"\nSimulação de aposta proporcional:")
print(f"Total apostado: R$ {total_apostado:.2f}")
print(f"Retorno obtido qualquer que seja o resultado: R$ {retorno_garantido:.2f}")
print(f"Perda certa do apostador (lucro da casa): R$ {perda_apostador:.2f} ({perc_perda:.2f}%)")

print("\nConclusão: A casa DIMINUI as odds para lucrar aproximadamente 5% (Alternativa C).")
