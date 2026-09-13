"""
Verificação combinatória e probabilística da Questão 12 - ENADE 2021 Matemática Licenciatura
"""
import math
from fractions import Fraction

def verificar_q012():
    n_geom = 4
    n_topo = 1
    n_alg = 2
    n_total = n_geom + n_topo + n_alg
    
    total_possibilidades = math.factorial(n_total)
    assert total_possibilidades == 5040
    
    # Casos favoráveis:
    # Topologia separa Geometria de Álgebra.
    # Como todos os de Geometria devem estar de um lado e todos os de Álgebra do outro:
    # Caso 1: (4 de Geometria) seguido de (1 de Topologia) seguido de (2 de Álgebra)
    # Permutações: 4! * 1! * 2! = 24 * 1 * 2 = 48
    # Caso 2: (2 de Álgebra) seguido de (1 de Topologia) seguido de (4 de Geometria)
    # Permutações: 2! * 1! * 4! = 2 * 1 * 24 = 48
    
    casos_favoraveis = 2 * (math.factorial(n_geom) * math.factorial(n_topo) * math.factorial(n_alg))
    assert casos_favoraveis == 96
    
    prob = Fraction(casos_favoraveis, total_possibilidades)
    assert prob == Fraction(2, 105)
    
    print(f"Total de permutações: {total_possibilidades}")
    print(f"Casos favoráveis: {casos_favoraveis}")
    print(f"Probabilidade exata: {prob} = {float(prob):.6f}")
    print("Alternativa D rigorosamente verificada!")

if __name__ == '__main__':
    verificar_q012()
