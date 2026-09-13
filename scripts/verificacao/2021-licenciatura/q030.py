"""
Verificação algébrica da Questão 30 - ENADE 2021 Matemática Licenciatura
Composição de transformações lineares no R^2:
1. Reflexão em torno do eixo x: R_x = [[1, 0], [0, -1]]
2. Rotação de 90° anti-horário: Rot_90 = [[0, -1], [1, 0]]
3. Dilatação de fator 2: D_2 = [[2, 0], [0, 2]]
"""
import numpy as np

def verificar_q030():
    v = np.array([20, 24])
    
    # 1. Matriz de reflexão no eixo x
    M_refl = np.array([
        [1, 0],
        [0, -1]
    ])
    v1 = M_refl @ v
    print(f"1. Após reflexão no eixo x: {v1}")
    assert np.array_equal(v1, [20, -24])
    
    # 2. Matriz de rotação de 90° anti-horário
    # [[cos(90°), -sen(90°)], [sen(90°), cos(90°)]] = [[0, -1], [1, 0]]
    M_rot = np.array([
        [0, -1],
        [1, 0]
    ])
    v2 = M_rot @ v1
    print(f"2. Após rotação de 90° anti-horário: {v2}")
    assert np.array_equal(v2, [24, 20])
    
    # 3. Matriz de dilatação de fator 2
    M_dil = np.array([
        [2, 0],
        [0, 2]
    ])
    v3 = M_dil @ v2
    print(f"3. Após dilatação de fator 2: {v3}")
    assert np.array_equal(v3, [48, 40])
    
    # Matriz composta da transformação T = D_2 * Rot_90 * R_x
    M_T = M_dil @ M_rot @ M_refl
    print("\nMatriz da transformação linear T:\n", M_T)
    v_final = M_T @ v
    print(f"T(20, 24) = {v_final}")
    assert np.array_equal(v_final, [48, 40])
    
    print("Alternativa B confirmada com rigor matricial!")

if __name__ == '__main__':
    verificar_q030()
