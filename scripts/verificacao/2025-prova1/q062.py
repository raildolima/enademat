"""Verificação numérica da Questão 62 - ENADE 2025 Prova 1.
Trilateração por circunferências:
  (x + 300)^2 + (y - 300)^2 = (447.2)^2  ~ 200000
  (x - 300)^2 + (y - 300)^2 = (282.8)^2  ~ 80000
  (x - 500)^2 + (y + 200)^2 = 500^2      = 250000
"""
from sympy import symbols, Eq, solve

def test_q062():
    x, y = symbols('x y', real=True)
    
    # 447.2 ~ sqrt(200000) ~ 447.213595...
    # 282.8 ~ sqrt(80000)  ~ 282.842712...
    # Verificando com os valores aproximados dados na prova:
    rA_sq = 447.2**2
    rB_sq = 282.8**2
    rC_sq = 500**2
    
    # Sistema exato da Alternativa A
    eqA = (x + 300)**2 + (y - 300)**2 - rA_sq
    eqB = (x - 300)**2 + (y - 300)**2 - rB_sq
    
    # Da diferença eqA - eqB:
    # (x + 300)^2 - (x - 300)^2 = rA_sq - rB_sq
    # 1200*x = 447.2^2 - 282.8^2
    diff_x = (rA_sq - rB_sq) / 1200
    print(f"Coordenada x aproximada do celular: {diff_x}")
    # Com 200000 - 80000 = 120000 -> 120000/1200 = 100!
    assert 99.9 < diff_x < 100.1
    
    # Para x = 100:
    # (100 - 300)^2 + (y - 300)^2 = 80000
    # (-200)^2 + (y - 300)^2 = 80000
    # 40000 + (y - 300)^2 = 80000 => (y - 300)^2 = 40000 => y - 300 = +-200 => y = 500 ou y = 100
    # Testando em C: (x - 500)^2 + (y + 200)^2 = 250000
    # Se x = 100, (100 - 500)^2 = (-400)^2 = 160000
    # (y + 200)^2 = 250000 - 160000 = 90000 => y + 200 = +-300 => y = 100 ou y = -500
    # A interseção comum é y = 100!
    # Ponto do celular: (100, 100)!
    
    ponto_celular = (100, 100)
    distA = ((100 + 300)**2 + (100 - 300)**2)**0.5
    distB = ((100 - 300)**2 + (100 - 300)**2)**0.5
    distC = ((100 - 500)**2 + (100 + 200)**2)**0.5
    
    print(f"Distância real A: {distA:.2f} m (prova deu 447,2)")
    print(f"Distância real B: {distB:.2f} m (prova deu 282,8)")
    print(f"Distância real C: {distC:.2f} m (prova deu 500)")
    
    assert abs(distA - 447.2) < 0.1
    assert abs(distB - 282.8) < 0.1
    assert abs(distC - 500.0) < 0.01
    
    print("Ponto único (100, 100) verificado com perfeição!")

if __name__ == "__main__":
    test_q062()
