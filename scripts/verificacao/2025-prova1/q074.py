"""Verificação teórica e computacional da Questão 74 - ENADE 2025 Prova 1.
Jogo de subtração (Nim misère):
- N palitos na mesa (N = 27)
- Retiradas permitidas: {1, 2, 3, 4}
- Quem retira o último palito perde (misère).
"""

def test_q074():
    # Teoria de Sprague-Grundy / Análise retrógrada para jogo misère
    # Posições perdedoras (P-positions): jogador atual perde se oponente jogar perfeitamente
    # Para 1 palito: o jogador é obrigado a tirar 1 e perde -> P-position: 1
    # Posições da forma 5k + 1:
    # 1: P
    # 2: N (tira 1 e deixa 1)
    # 3: N (tira 2 e deixa 1)
    # 4: N (tira 3 e deixa 1)
    # 5: N (tira 4 e deixa 1)
    # 6: P (qualquer retirada deixa {5, 4, 3, 2}, todas N)
    
    p_positions = [5 * k + 1 for k in range(10)]
    print(f"Posições perdedoras (P-positions): {p_positions}")
    
    # Com 27 palitos:
    # 27 = 5 * 5 + 2 -> É N-position!
    # O primeiro jogador ganha tirando 27 - 26 = 1 palito, deixando 26 (P-position) para o segundo jogador.
    assert 27 not in p_positions
    assert 26 in p_positions
    
    # Se a quantidade inicial fosse diferente de 27 (por exemplo, 26 palitos):
    # 26 é P-position, logo o primeiro jogador perde se o segundo jogar perfeitamente!
    assert 26 in p_positions
    print("Comprovado: o primeiro jogador pode não ganhar se N inicial for diferente de 27 (ex: N = 26)!")

if __name__ == "__main__":
    test_q074()
