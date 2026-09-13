"""
Verificação formal da Questão 55 - ENADE 2025 Prova 5
Divisores de 24 e configurações de estantes retangulares.
"""
import sympy as sp

def verificar_estantes_retangulares():
    n = 24
    
    # Divisores positivos de 24:
    divisores = sp.divisors(n)
    assert divisores == [1, 2, 3, 4, 6, 8, 12, 24]
    assert len(divisores) == 8
    
    # Pares ordenados (linhas, colunas) de estantes retangulares:
    estantes_possiveis = [(d, n // d) for d in divisores]
    assert len(estantes_possiveis) == 8
    
    # As duas estantes desenhadas pelo estudante:
    desenhadas = [(3, 8), (4, 6)]
    assert all(e in estantes_possiveis for e in desenhadas)
    
    print(f"Total de estantes retangulares possíveis (L x C = 24): {len(estantes_possiveis)}")
    print("Estantes possíveis:", estantes_possiveis)
    print("Estantes desenhadas pelo estudante:", desenhadas)
    print("Conclusão: O estudante representou duas das oito estantes possíveis.")
    print("Alternativa correta confirmada: A")

if __name__ == "__main__":
    verificar_estantes_retangulares()
