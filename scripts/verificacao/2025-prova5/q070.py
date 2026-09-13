"""
Verificação Numérica das Questões 70, 71 e 72 — ENADE 2025 Prova 5
Otimização com Cálculo Diferencial (Curral de Área Máxima) e Genética Mendeliana / Probabilidade (Sistema ABO).
"""
import sympy as sp

def testar_q070_q071():
    # Perímetro total = 80 m
    # 2x + 2y = 80 => y = 40 - x
    x = sp.Symbol('x', real=True)
    y = 40 - x
    f = x * y
    # f(x) = 40*x - x**2
    assert sp.expand(f) == 40*x - x**2, "Função área incorreta"
    
    # Derivada df/dx:
    df = sp.diff(f, x)
    assert df == 40 - 2*x, "Derivada incorreta"
    print(f"Q70: f(x) = {f}, df/dx = {df}")

    # Ponto crítico (área máxima):
    sol_x = sp.solve(df, x)
    assert len(sol_x) == 1 and sol_x[0] == 20, "x ótimo deve ser 20"
    x_opt = sol_x[0]
    y_opt = y.subs(x, x_opt)
    assert y_opt == 20, "y ótimo deve ser 20"
    print(f"Q71: Dimensões ótimas: x = {x_opt} m, y = {y_opt} m (Quadrado).")

def testar_q072():
    # Pais de sangue A com filho O (ii):
    # Ambos os pais são heterozigotos I^A i.
    # Cruzamento: {I^A, i} x {I^A, i}
    # Espaço amostral equiprovável (4 possibilidades):
    # - I^A I^A: tipo A
    # - I^A i: tipo A
    # - i I^A: tipo A
    # - i i: tipo O
    prob_O = 1 / 4 # 25%
    prob_A = 3 / 4 # 75%
    assert prob_O == 0.25
    assert prob_A == 0.75
    print(f"Q72: P(O) = {prob_O*100:.0f}%, P(A) = {prob_A*100:.0f}%.")

if __name__ == "__main__":
    testar_q070_q071()
    testar_q072()
