"""Verificação etnomatemática da Questão 65 - ENADE 2025 Prova 1.
Desenhos Sona (Paulus Gerdes):
  Quantidade de linhas fechadas = mdc(linhas, colunas)
"""
import math

def test_q065():
    filas = 6
    colunas = 9
    linhas_fechadas = math.gcd(filas, colunas)
    
    print(f"filas={filas}, colunas={colunas}, mdc={linhas_fechadas}")
    assert linhas_fechadas == 3, f"Esperado 3, obtido {linhas_fechadas}"
    
    # Verificação com os exemplos clássicos da imagem de Gerdes
    # Exemplo 1: 3x4 -> mdc(3, 4) = 1 (1 linha fecha tudo)
    assert math.gcd(3, 4) == 1
    # Exemplo 2: 4x6 -> mdc(4, 6) = 2 (2 linhas fechadas)
    assert math.gcd(4, 6) == 2
    # Exemplo 3: 2x4 -> mdc(2, 4) = 2
    assert math.gcd(2, 4) == 2
    
    print("Verificação de Q65 com Gerdes e MDC concluída com sucesso!")

if __name__ == "__main__":
    test_q065()
