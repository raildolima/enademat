"""
Verificação das Questões 79 e 80 — ENADE 2025 Prova 5
Aritmética Modular / Cifra de César (Q79) e Geometria Plana / Colinearidade e Pitágoras (Q80).
"""
import numpy as np

def testar_q079():
    # Palavra: 04 - 13 - 18 - 08 - 13 - 14
    # Chave: 14
    pre = [4, 13, 18, 8, 13, 14]
    chave = 14
    soma = [x + chave for x in pre]
    assert soma == [18, 27, 32, 22, 27, 28]

    # Redução modular mod 26:
    codificado = [x % 26 for x in soma]
    assert codificado == [18, 1, 6, 22, 1, 2]
    cod_str = " – ".join(f"{x:02d}" for x in codificado)
    print("Q79: Codificação final:", cod_str)
    assert cod_str == "18 – 01 – 06 – 22 – 01 – 02"

def testar_q080():
    # Coordenadas dos vértices com D na origem (0, 0):
    # C = (0, 2), B = (2, 2)
    # E = (6, 0), A = (6, 8)
    D = np.array([0, 0])
    B = np.array([2, 2])
    A = np.array([6, 8])

    # Vetores DB e DA:
    v_DB = B - D # (2, 2)
    v_DA = A - D # (6, 8)

    # Inclinações:
    m_DB = v_DB[1] / v_DB[0] # 2/2 = 1.0
    m_DA = v_DA[1] / v_DA[0] # 8/6 = 4/3 approx 1.333
    assert m_DB != m_DA, "DB e DA não são colineares"

    # Medidas das hipotenusas calculadas pelo estudante:
    x_est = np.linalg.norm(v_DB) # sqrt(8) = 2*sqrt(2) approx 2.828
    y_est = np.linalg.norm(v_DA) # sqrt(6^2 + 8^2) = 10.0
    diff_est = y_est - x_est # 10 - 2*sqrt(2) approx 7.17157

    # Distância real AB:
    dist_AB_real = np.linalg.norm(A - B) # sqrt((6-2)^2 + (8-2)^2) = sqrt(16 + 36) = sqrt(52) = 2*sqrt(13) approx 7.21110
    print(f"Q80: m_DB = {m_DB}, m_DA = {m_DA:.3f} (não colineares!)")
    print(f"Q80: y - x = {diff_est:.5f} vs AB real = {dist_AB_real:.5f}")
    assert abs(diff_est - dist_AB_real) > 0.03, "A subtração y - x não é igual a AB"
    print("Q80: Resolução do estudante é parcialmente correta (erro de colinearidade). Alternativa D confirmada!")

if __name__ == "__main__":
    testar_q079()
    testar_q080()
