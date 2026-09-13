"""Verificação geométrica da Questão 66 - ENADE 2025 Prova 1.
Circuncentro de um triângulo com vértices:
  E = (4, 7)
  P = (1, 2)
  B = (9, 3)
"""
from sympy import symbols, Eq, solve

def test_q066():
    x, y = symbols('x y', real=True)
    
    # Circuncentro (x, y) deve satisfazer:
    # dist^2(O, E) = dist^2(O, P) = dist^2(O, B)
    # (x - 4)^2 + (y - 7)^2 = (x - 1)^2 + (y - 2)^2
    # (x - 4)^2 + (y - 7)^2 = (x - 9)^2 + (y - 3)^2
    
    dE_sq = (x - 4)**2 + (y - 7)**2
    dP_sq = (x - 1)**2 + (y - 2)**2
    dB_sq = (x - 9)**2 + (y - 3)**2
    
    eq1 = Eq(dE_sq, dP_sq)  # mediatriz de EP
    eq2 = Eq(dE_sq, dB_sq)  # mediatriz de EB
    
    sol = solve([eq1, eq2], (x, y))
    print(f"Coordenadas do circuncentro: {sol}")
    
    ox = sol[x]
    oy = sol[y]
    
    # Verificar distâncias
    rE = ((ox - 4)**2 + (oy - 7)**2)**0.5
    rP = ((ox - 1)**2 + (oy - 2)**2)**0.5
    rB = ((ox - 9)**2 + (oy - 3)**2)**0.5
    
    print(f"Distância aos três vértices (raio da circunferência circunscrita): {rE:.4f}")
    assert abs(rE - rP) < 1e-10
    assert abs(rE - rB) < 1e-10
    
    print("Circuncentro verificado com equidistância exata aos três vértices!")

if __name__ == "__main__":
    test_q066()
