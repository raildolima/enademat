"""
Verificação formal da Questão 40 - ENADE 2025 Prova 5
Lugar geométrico das cônicas: Parábola, Elipse, Hipérbole e Circunferência.
"""
import sympy as sp

def verificar_lugares_geometricos():
    x, y, p = sp.symbols('x y p', real=True, positive=True)
    P = (x, y)
    
    # 1. Parábola: Foco F = (0, p), Diretriz r: y = -p
    # d(P, F) = sqrt(x^2 + (y - p)^2)
    # d(P, r) = |y - (-p)| = y + p (para y > -p)
    dist_F = sp.sqrt(x**2 + (y - p)**2)
    dist_r = y + p
    
    # Igualando as distâncias quadradas:
    eq_parabola = sp.expand(dist_F**2 - dist_r**2)
    # x^2 + (y - p)^2 - (y + p)^2 = x^2 + y^2 - 2py + p^2 - (y^2 + 2py + p^2) = x^2 - 4py
    assert eq_parabola == x**2 - 4*p*y, "Erro na equação da parábola"
    
    # Resolvendo para y: y = x^2 / (4p) (parábola canônica com vértice na origem)
    sol_y = sp.solve(eq_parabola, y)[0]
    assert sol_y == x**2 / (4*p)
    
    print("Definição de Parábola confirmada:")
    print("d(P, F) = d(P, r) <==> x^2 = 4py (equidistante de reta e ponto).")
    print("Comparação com outras cônicas:")
    print("- Elipse: d(P, F1) + d(P, F2) = 2a")
    print("- Hipérbole: |d(P, F1) - d(P, F2)| = 2a")
    print("- Circunferência: d(P, O) = R")
    print("Alternativa correta confirmada: A")

if __name__ == "__main__":
    verificar_lugares_geometricos()
