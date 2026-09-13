"""
Verificação das Questões 73, 74 e 75 — ENADE 2025 Prova 5
Probabilidade e NIPT (Q73), Geometria Analítica e Produto Misto (Q74) e Algeplan / Álgebra Geométrica (Q75).
"""
import numpy as np
import sympy as sp

def testar_q073():
    # Taxa de risco: 1 em 100 000
    p = 1 / 100000
    p_perc = p * 100 # 0.001%
    assert p_perc == 0.001
    assert p_perc < 0.01, "Deve ser classificado como baixo risco (< 0.01%)"
    print(f"Q73: Taxa de risco = {p_perc:.3f}% (< 0.01% => Baixo Risco). Análise do estudante incorreta!")

def testar_q074():
    u = np.array([1, 2, -1])
    v = np.array([2, -1, 3])
    w = np.array([0, 1, 2])
    
    mat = np.array([u, v, w])
    det_val = np.linalg.det(mat)
    volume = abs(round(det_val))
    assert volume == 15, f"Volume incorreto: {volume}"
    print(f"Q74: Determinante = {det_val:.1f} => Volume = {volume} (módulo do produto misto).")

def testar_q075():
    # Área total do quadrado de lado a: a^2
    # Área do quadrado menor não colorido de lado b: b^2
    # Área colorida: a^2 - b^2
    a, b = sp.symbols('a b', positive=True)
    area_colorida = a**2 - b**2
    assert area_colorida == sp.expand((a - b)*(a + b))
    print("Q75: Área colorida = a^2 - b^2.")

if __name__ == "__main__":
    testar_q073()
    testar_q074()
    testar_q075()
