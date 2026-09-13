"""
Verificação numérica e estatística da Questão 44 do ENADE 2025 (Prova 1).
Calcula a média correta de pontos por partida e evidencia o absurdo da média 5,2.
"""

# Dados da 6ª rodada do Campeonato Brasileiro (10 jogos):
# 6 vitórias (cada uma gera 3 pontos: 3 para o vencedor, 0 para o perdedor)
# 4 empates (cada um gera 2 pontos: 1 para cada time)
vitorias = 6
empates = 4
total_jogos = vitorias + empates # 10 jogos

pontos_vitorias = vitorias * 3 # 18 pontos
pontos_empates = empates * 2   # 8 pontos
total_pontos = pontos_vitorias + pontos_empates # 26 pontos

media_correta = total_pontos / total_jogos # 26 / 10 = 2.6
media_estudante = total_pontos / 5        # 26 / 5 = 5.2

print(f"Total de jogos da rodada: {total_jogos}")
print(f"Total de pontos distribuídos: {total_pontos}")
print(f"Média correta de pontos por jogo: {media_correta:.2f}")
print(f"Média calculada pelo estudante: {media_estudante:.2f}")

# Demonstração do absurdo lógico de media = 5.2:
# Em qualquer jogo de futebol, os pontos distribuídos são:
# Vitória: 3 + 0 = 3 pontos
# Empate: 1 + 1 = 2 pontos
# Pontuação máxima possível em qualquer jogo: 3 pontos.
# É matematicamente impossível uma média ser 5,2 se todos os valores estão no conjunto {2, 3}!
assert max(2, 3) < media_estudante, "A média do estudante ultrapassa o valor máximo de qualquer partida!"
print("\nConclusão: a média de 5,2 é logicamente inconsistente, confirmando a abordagem da Alternativa A.")
