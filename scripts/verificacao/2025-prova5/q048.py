"""
Verificação formal da Questão 48 - ENADE 2025 Prova 5
Quadrados Mágicos 3x3 e Primalidade (Padrão 1 e Padrão 2).
"""
import sympy as sp

def checar_quadrado_magico(matriz, nome):
    n = len(matriz)
    soma_esperada = sum(matriz[0])
    
    # Checar linhas
    for i, linha in enumerate(matriz):
        assert sum(linha) == soma_esperada, f"{nome}: Linha {i} com soma divergente"
        
    # Checar colunas
    for j in range(n):
        soma_col = sum(matriz[i][j] for i in range(n))
        assert soma_col == soma_esperada, f"{nome}: Coluna {j} com soma divergente"
        
    # Checar diagonais
    diag_p = sum(matriz[i][i] for i in range(n))
    diag_s = sum(matriz[i][n - 1 - i] for i in range(n))
    assert diag_p == soma_esperada, f"{nome}: Diagonal principal divergente"
    assert diag_s == soma_esperada, f"{nome}: Diagonal secundária divergente"
    
    return soma_esperada

def verificar_padroes():
    padrao_1 = [
        [67, 1, 43],
        [13, 37, 61],
        [31, 73, 7]
    ]
    
    padrao_2 = [
        [71, 5, 101],
        [89, 59, 29],
        [17, 113, 47]
    ]
    
    # 1. Checar se são quadrados mágicos
    soma_1 = checar_quadrado_magico(padrao_1, "Padrão 1")
    soma_2 = checar_quadrado_magico(padrao_2, "Padrão 2")
    assert soma_1 == 111
    assert soma_2 == 177
    
    # 2. Teste de primalidade dos elementos
    elementos_1 = [x for linha in padrao_1 for x in linha]
    nao_primos_1 = [x for x in elementos_1 if not sp.isprime(x)]
    assert nao_primos_1 == [1], f"Esperado apenas [1] como não-primo no Padrão 1, obtido {nao_primos_1}"
    
    elementos_2 = [x for linha in padrao_2 for x in linha]
    nao_primos_2 = [x for x in elementos_2 if not sp.isprime(x)]
    assert nao_primos_2 == [], f"Esperado todos primos no Padrão 2, obtido não-primos: {nao_primos_2}"
    
    print(f"Padrão 1: É Quadrado Mágico perfeito com soma {soma_1}.")
    print(f"Padrão 1: Contém elemento não-primo: {nao_primos_1} (o número 1 não é primo).")
    print(f"Padrão 2: É Quadrado Mágico perfeito com soma {soma_2}, todos primos.")
    print("Alternativa correta confirmada: C")

if __name__ == "__main__":
    verificar_padroes()
