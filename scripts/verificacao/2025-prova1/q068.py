"""Verificação de probabilidade da Questão 68 - ENADE 2025 Prova 1.
Lançamento de dois dados viciados onde:
  P(5) = 3/8
  P(1) = P(2) = P(3) = P(4) = P(6) = 1/8
Evento: d1 * d2 >= 18
"""
from fractions import Fraction

def test_q068():
    # Probabilidades de cada face
    prob = {
        1: Fraction(1, 8),
        2: Fraction(1, 8),
        3: Fraction(1, 8),
        4: Fraction(1, 8),
        5: Fraction(3, 8),
        6: Fraction(1, 8),
    }
    
    # Conferir soma 1
    assert sum(prob.values()) == Fraction(1, 1)
    
    prob_total = Fraction(0, 1)
    pares_favoraveis = []
    
    for d1 in range(1, 7):
        for d2 in range(1, 7):
            if d1 * d2 >= 18:
                p_par = prob[d1] * prob[d2]
                prob_total += p_par
                pares_favoraveis.append((d1, d2, d1 * d2, p_par))
                
    print(f"Quantidade de pares favoráveis: {len(pares_favoraveis)}")
    print(f"Probabilidade total obtida: {prob_total}")
    
    # Com denominador 64
    num_64 = prob_total.numerator * (64 // prob_total.denominator)
    print(f"Representação com denominador 64: {num_64}/64")
    
    assert prob_total == Fraction(26, 64)
    assert num_64 == 26
    
    print("Verificação de Q68 concluída com 100% de sucesso!")

if __name__ == "__main__":
    test_q068()
