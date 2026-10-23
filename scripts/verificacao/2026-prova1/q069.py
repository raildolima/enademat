# Q69 - distribuição cíclica de estudantes em seis equipes (lista alfabética).
# Posição p (1, 2, 3, ...) vai para a equipe ((p - 1) mod 6) + 1.

def equipe(p):
    return ((p - 1) % 6) + 1

# Confere o padrão com a tabela do texto-base (posições 1 a 13).
tabela = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5, 12: 6, 13: 1}
assert all(equipe(p) == e for p, e in tabela.items())
print("padrao da tabela confere: equipe(p) = ((p-1) mod 6) + 1")

# A) Turma de 24 estudantes em posicoes arbitrarias: contraexemplo com todos na equipe 1.
turma = [1 + 6 * k for k in range(24)]
print("A) equipes da turma (contraexemplo):", sorted({equipe(p) for p in turma}), "-> cada equipe com 4? NAO")

# B) posicao 104.
print("B) posicao 104 -> equipe", equipe(104), "(par?", equipe(104) % 2 == 0, ")")

# C) Escola com 36 estudantes; contraexemplo: escola cujos alunos estao nas posicoes 1, 7, 13 (todos equipe 1).
escola = [1 + 6 * k for k in range(3)]
print("C) equipes de uma escola (contraexemplo):", sorted({equipe(p) for p in escola}), "-> um por equipe? NAO")

# D) posicao 306.
print("D) posicao 306 -> equipe", equipe(306), "(alternativa afirma 5)")

correta = [letra for letra, ok in {"A": False, "B": equipe(104) % 2 == 0, "C": False, "D": equipe(306) == 5}.items() if ok]
print("alternativa(s) verdadeira(s):", correta)
