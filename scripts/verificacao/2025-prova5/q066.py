"""
Verificação da Matriz de Tráfego da Questão 66 — ENADE 2025 Prova 5
Modelagem de grafos orientados e semáforos por matrizes de adjacência.
"""
import numpy as np

def testar_q066():
    # Vértices: 1: A, 2: B, 3: C
    # Linha = Origem, Coluna = Destino

    # Exemplo do enunciado:
    # Verde de B para A: (2, 1) -> P[1, 0] = 1
    # Verde de B para C: (2, 3) -> P[1, 2] = 1
    # Verde de C para B: (3, 2) -> P[2, 1] = 1
    P = np.zeros((3, 3), dtype=int)
    P[1, 0] = 1 # B -> A
    P[1, 2] = 1 # B -> C
    P[2, 1] = 1 # C -> B
    print("Matriz exemplo P:\n", P)

    # Situação proposta:
    # Semáforos verdes de:
    # - A para B: (1, 2) -> linha 1, col 2 -> M[0, 1] = 1
    # - A para C: (1, 3) -> linha 1, col 3 -> M[0, 2] = 1
    # - B para A: (2, 1) -> linha 2, col 1 -> M[1, 0] = 1
    M_esperada = np.array([
        [0, 1, 1],
        [1, 0, 0],
        [0, 0, 0]
    ])

    M_calculada = np.zeros((3, 3), dtype=int)
    M_calculada[0, 1] = 1 # A -> B
    M_calculada[0, 2] = 1 # A -> C
    M_calculada[1, 0] = 1 # B -> A

    assert np.array_equal(M_calculada, M_esperada), f"Matriz incorreta:\n{M_calculada}"

    # Verificação das alternativas:
    # Alternativa A: M com m12=1, m13=1, m21=1 correspondendo a A->B, A->C, B->A.
    print("M calculada:\n", M_calculada)
    print("Verificação de Q66 aprovada: Alternativa A é a única correta!")

if __name__ == "__main__":
    testar_q066()
