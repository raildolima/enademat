"""
Verificação estatística da Questão 45 do ENADE 2025 (Prova 1).
Analisa a distribuição de gols nas 10 partidas da 6ª rodada e o impacto do zero.
"""

# Resultados dos 10 jogos da rodada conforme o Texto 2:
# 4 partidas com 4 gols (4 * 4 = 16)
# 2 partidas com 1 gol  (2 * 1 = 2)
# 4 partidas com 1 gol? Na fórmula do aluno: 4*4 + 2*1 + 4*1 + 2*2 + 3 = 16 + 2 + 4 + 4 + 3 = 29 gols.
# A soma dos gols das partidas é 29.
total_gols = 29
total_partidas_real = 10
partidas_com_gol = 9
partidas_sem_gol = 1 # 0 a 0

media_correta = total_gols / total_partidas_real # 29 / 10 = 2.9
media_sem_zero = total_gols / partidas_com_gol   # 29 / 9 = 3.222...

print(f"Total de partidas na rodada: {total_partidas_real}")
print(f"Total de gols marcados: {total_gols}")
print(f"Média real de gols por partida (incluindo o 0 a 0): {media_correta:.2f}")
print(f"Média calculada pelo aluno (excluindo a partida com 0 gols): {media_sem_zero:.4f} (29/9)")

# Análise pedagógica:
# O aluno excluiu o jogo com 0 gols do denominador (n = 9 em vez de n = 10).
# O zero foi tratado como 'ausência de jogo' em vez de 'jogo com zero gols'.
print("\nErro identificado: o valor zero foi excluído do espaço amostral.")
print("A intervenção adequada visa investigar a presença do zero estatístico (Alternativa C).")
