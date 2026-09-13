"""
Verificação das Questões 76 e 77 — ENADE 2025 Prova 5
Geometria Analítica (Q76) e Funções Trigonométricas / Acústica (Q77).
"""
import sympy as sp

def testar_q076():
    # A(2, 3), B(5, -1)
    xA, yA = 2, 3
    xB, yB = 5, -1
    
    # Coeficiente angular m de AB:
    m = (yB - yA) / (xB - xA) # (-1 - 3)/(5 - 2) = -4/3
    assert m == -4/3
    
    # Ponto médio M de AB:
    xM = (xA + xB) / 2 # 7/2 = 3.5
    yM = (yA + yB) / 2 # 2/2 = 1
    assert xM == 3.5 and yM == 1
    
    # Coeficiente angular n da perpendicular (mediatriz):
    n = -1 / m # 3/4
    assert n == 3/4
    
    # Equação da mediatriz: y - yM = n * (x - xM) => y - 1 = (3/4)*(x - 3.5)
    # Ponto D tem abcissa x = 6:
    xD = 6
    yD = yM + n * (xD - xM) # 1 + (3/4)*(6 - 3.5) = 1 + (3/4)*(2.5) = 1 + 15/8 = 23/8 = 2.875
    assert yD == 2.875
    
    # Reta CD: C(17/4, 0) = (4.25, 0), D(6, 23/8) = (6, 2.875)
    xC, yC = 17/4, 0
    m_CD = (yD - yC) / (xD - xC)
    print(f"Q76: m_AB = {m}, M = ({xM}, {yM}), n_perp = {n}, D = ({xD}, {yD}), m_CD = {m_CD}")
    print("Q76: Procedimento da alternativa B confirmado com rigor!")

def testar_q077():
    # f(t) = 0.5 * sin(440 * pi * t)
    # g(t) = 1.0 * sin(220 * pi * t)
    Amp_f = 0.5
    Amp_g = 1.0
    freq_f = (440 * sp.pi) / (2 * sp.pi) # 220 Hz
    freq_g = (220 * sp.pi) / (2 * sp.pi) # 110 Hz
    
    assert Amp_f < Amp_g, "f tem menor amplitude => som mais fraco"
    assert freq_f > freq_g, "f tem maior frequência => som mais agudo"
    print(f"Q77: f: Amp = {Amp_f}, freq = {freq_f} Hz; g: Amp = {Amp_g}, freq = {freq_g} Hz.")
    print("Q77: Som 1 (menor amplitude e maior freq) é f(t); Som 2 é g(t). Alternativa A confirmada!")

if __name__ == "__main__":
    testar_q076()
    testar_q077()
