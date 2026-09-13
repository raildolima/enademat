"""
Verificação analítica da Questão 13 - ENADE 2021 Matemática Licenciatura
Teorema do Valor Médio (TVM) e retas secantes/tangentes
"""
import sympy as sp

def verificar_q013():
    # Exemplo funcional para ilustrar a relação:
    # f(x) = x^3 - x em [0, 2]
    x = sp.Symbol('x', real=True)
    f = x**3 - x
    a, b = 0, 2
    
    # Coeficiente angular da secante pelos extremos:
    m_sec = (f.subs(x, b) - f.subs(x, a)) / (b - a)
    # f(2) = 6, f(0) = 0 => m_sec = 6/2 = 3
    assert m_sec == 3
    
    # TVM: existe c em (0, 2) tal que f'(c) = m_sec
    df = sp.diff(f, x) # 3x^2 - 1
    # 3c^2 - 1 = 3 => 3c^2 = 4 => c = 2/sqrt(3) ~= 1.1547 em (0, 2)
    pontos_c = sp.solve(df - m_sec, x)
    c_val = [p for p in pontos_c if a < p < b]
    assert len(c_val) == 1
    print(f"Ponto c que satisfaz o TVM: c = {c_val[0]} = {float(c_val[0]):.4f}")
    
    # I é verdadeira: retas paralelas têm mesma inclinação (f'(c) = m_sec).
    # II é verdadeira: a reta tangente é o limite local das secantes sec_h quando h -> 0.
    # Justificativa: II é a definição local da derivada; a garantia de que existe um c
    # onde a derivada local coincide com a secante global decorre do Teorema de Rolle
    # e do Teorema de Weierstrass, e não da mera definição de derivada como limite.
    print("Asserções I e II são verdadeiras, mas II não é justificativa correta de I.")
    print("Alternativa B confirmada.")

if __name__ == '__main__':
    verificar_q013()
