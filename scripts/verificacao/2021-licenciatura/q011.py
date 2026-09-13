"""
Verificação analítica e simbólica da Questão 11 - ENADE 2021 Matemática Licenciatura
Elipse: x^2/a^2 + y^2/b^2 = 1, com a > b > 0
"""
import sympy as sp

def verificar_q011():
    x, y, a, b = sp.symbols('x y a b', real=True)
    eq_reduzida = x**2 / a**2 + y**2 / b**2 - 1
    
    # I. -a <= x <= a e -b <= y <= b
    # Como y^2/b^2 >= 0, x^2/a^2 = 1 - y^2/b^2 <= 1 => x^2 <= a^2 => -a <= x <= a
    print("Afirmação I: Verdadeira. O domínio e imagem da elipse são [-a, a] e [-b, b].")
    
    # II. Elipse contida em circunferência de raio b
    # O ponto (a, 0) pertence à elipse: a^2/a^2 + 0 = 1.
    # A distância de (a, 0) à origem é a. Como a > b, a distância excede o raio b.
    # Logo a elipse NÃO está contida na circunferência de raio b (estaria na de raio a).
    print("Afirmação II: Falsa. O semieixo maior a > b transborda o círculo de raio b.")
    
    # III. Simetrias em relação à origem e aos eixos coordenados
    eq_ponto1 = eq_reduzida.subs({x: -x, y: -y})
    eq_ponto2 = eq_reduzida.subs({x: x, y: -y})
    eq_ponto3 = eq_reduzida.subs({x: -x, y: y})
    
    assert sp.simplify(eq_ponto1 - eq_reduzida) == 0
    assert sp.simplify(eq_ponto2 - eq_reduzida) == 0
    assert sp.simplify(eq_ponto3 - eq_reduzida) == 0
    print("Afirmação III: Verdadeira. A equação tem simetria reflexiva nos eixos e central na origem.")
    
    # IV. Outra forma: b^2 x^2 + a^2 y^2 - a^2 b^2 = 0
    eq_geral = b**2 * x**2 + a**2 * y**2 - a**2 * b**2
    assert sp.simplify(eq_geral - a**2 * b**2 * eq_reduzida) == 0
    print("Afirmação IV: Verdadeira. Forma polinomial geral equivalente.")
    
    print("\nAfirmações corretas: I, III e IV -> Alternativa E.")

if __name__ == '__main__':
    verificar_q011()
