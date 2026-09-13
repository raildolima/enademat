"""
Verificação da Questão 22 - ENADE 2021 Matemática Licenciatura
Jogo Salto de Rã e função discreta y = 2n + n^2
"""

def verificar_q022():
    # n = número de peças de cada lado (ou parâmetro de peças)
    # y = número mínimo de movimentos = 2n + n^2
    # n in {1, 2, 3, 4, 5, ...}
    pontos = []
    for n in range(1, 6):
        y = 2 * n + n**2
        pontos.append((n, y))
        
    print("Tabela de valores da função discreta y = 2n + n^2:")
    for n, y in pontos:
        print(f"n = {n} -> y = {y}")
        
    assert pontos[0] == (1, 3)
    assert pontos[1] == (2, 8)
    assert pontos[2] == (3, 15)
    assert pontos[3] == (4, 24)
    assert pontos[4] == (5, 35)
    
    # Propriedades do gráfico:
    # 1. É uma função discreta, logo o gráfico é formado por pontos ISOLADOS no plano cartesiano,
    #    e não por uma linha ou curva contínua.
    # 2. O domínio é discreto (número natural positivo n >= 1), portanto todos os pontos
    #    pertencem estritamente ao primeiro quadrante.
    # 3. A taxa de variação é estritamente crescente (dy/dn = 2n + 2 > 0), com concavidade voltada para cima.
    print("\nCaracterísticas do gráfico:")
    print("- Pontos isolados discretos no 1º quadrante.")
    print("- Crescimento acelerado (quadrático).")
    print("A única alternativa que apresenta os pontos discretos (1, 3), (2, 8), etc., no 1º quadrante é a Alternativa A.")

if __name__ == '__main__':
    verificar_q022()
