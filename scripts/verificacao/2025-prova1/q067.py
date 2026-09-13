"""Verificação analítica da Questão 67 - ENADE 2025 Prova 1.
Distâncias no plano cartesiano (em km):
  Casa: (0.2, 0.2)
  Escola: (0.8, 1.0)
  Tia: (0.5, 0.6)
  Mercadinho: (0.8, 0.2)
  Padaria: (1.0, 0.8)
  Vovó: (-0.4, 1.0)
"""
import math

def dist(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def test_q067():
    casa = (0.2, 0.2)
    escola = (0.8, 1.0)
    tia = (0.5, 0.6)
    merc = (0.8, 0.2)
    pad = (1.0, 0.8)
    vovo = (-0.4, 1.0)
    
    # Rota A: Casa -> Tia -> Escola -> Tia -> Casa
    rotaA = 2 * (dist(casa, tia) + dist(tia, escola))
    # Rota B: Casa -> Mercadinho -> Escola -> Mercadinho -> Casa
    rotaB = 2 * (dist(casa, merc) + dist(merc, escola))
    # Rota C: Casa -> Padaria -> Escola -> Padaria -> Casa
    rotaC = 2 * (dist(casa, pad) + dist(pad, escola))
    # Rota D: Casa -> Vovó -> Escola -> Vovó -> Casa
    rotaD = 2 * (dist(casa, vovo) + dist(vovo, escola))
    
    print(f"Distância Rota A (Tia): {rotaA:.3f} km")
    print(f"Distância Rota B (Mercadinho): {rotaB:.3f} km")
    print(f"Distância Rota C (Padaria): {rotaC:.3f} km")
    print(f"Distância Rota D (Vovó): {rotaD:.3f} km")
    
    assert math.isclose(rotaA, 2.0, rel_tol=1e-5)
    assert math.isclose(rotaB, 2.8, rel_tol=1e-5)
    assert math.isclose(rotaC, 2.5657, abs_tol=1e-3)
    assert math.isclose(rotaD, 4.4, rel_tol=1e-5)
    
    # Apenas a rota D supera 3 km
    assert rotaA < 3.0
    assert rotaB < 3.0
    assert rotaC < 3.0
    assert rotaD > 3.0
    
    print("Verificação das rotas de Q67 concluída com 100% de precisão!")

if __name__ == "__main__":
    test_q067()
