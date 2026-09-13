"""Verificação numérica da Questão 57 - ENADE 2025 Prova 1.
Teorema do Resto Chinês (CRT) e inversos modulares.
Sistema:
  n ≡ 2 (mod 3)
  n ≡ 3 (mod 5)
  n ≡ 2 (mod 7)
"""
from sympy.ntheory.modular import crt

def test_q057():
    # crt(modulos, restos) em SymPy
    # crt([m1, m2, m3], [r1, r2, r3])
    modulos = [3, 5, 7]
    restos = [2, 3, 2]
    
    sol, m = crt(modulos, restos)
    print(f"Módulo m = {m}")
    print(f"Solucao unica modulo {m}: n = {sol} (mod {m})")
    
    # Verificação manual passo a passo
    m_calc = 3 * 5 * 7
    assert m_calc == 105
    M1 = 105 // 3  # 35
    M2 = 105 // 5  # 21
    M3 = 105 // 7  # 15
    
    # Inversos
    # 35 * N1 ≡ 1 (mod 3) -> 2 * N1 ≡ 1 (mod 3) -> N1 = 2
    N1 = pow(M1, -1, 3)
    # 21 * N2 ≡ 1 (mod 5) -> 1 * N2 ≡ 1 (mod 5) -> N2 = 1
    N2 = pow(M2, -1, 5)
    # 15 * N3 ≡ 1 (mod 7) -> 1 * N3 ≡ 1 (mod 7) -> N3 = 1
    N3 = pow(M3, -1, 7)
    
    assert N1 == 2
    assert N2 == 1
    assert N3 == 1
    
    x = 2 * M1 * N1 + 3 * M2 * N2 + 2 * M3 * N3
    assert x == 2 * 35 * 2 + 3 * 21 * 1 + 2 * 15 * 1
    assert x == 140 + 63 + 30
    assert x == 233
    
    r = x % 105
    assert r == 23
    assert sol == 23
    
    # Verificar condições
    assert 23 % 3 == 2
    assert 23 % 5 == 3
    assert 23 % 7 == 2
    
    print("Todas as asserções passaram com sucesso!")

if __name__ == "__main__":
    test_q057()
