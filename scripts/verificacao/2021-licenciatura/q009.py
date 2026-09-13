"""
Verificação numérica e simbólica da Questão 09 - ENADE 2021 Matemática Licenciatura
"""
import sympy as sp

def verificar_q009():
    t = sp.Symbol('t', real=True, positive=True)
    
    # I. C(t) = 2^(t/3)
    # No enunciado: dobra a cada 3 dias e C(0) = 1 (visto no gráfico C(0)=1, C(3)=2, C(6)=4, C(9)=8)
    C = 2**(t/3)
    
    val_0 = C.subs(t, 0)
    val_3 = C.subs(t, 3)
    val_6 = C.subs(t, 6)
    val_9 = C.subs(t, 9)
    
    assert val_0 == 1
    assert val_3 == 2
    assert val_6 == 4
    assert val_9 == 8
    print("Afirmação I verificada: C(t) = 2^(t/3)")
    
    # II. Velocidade de crescimento (derivada C'(t)) no nono dia (t=9)
    # d/dt [2^(t/3)] = 1/3 * ln(2) * 2^(t/3)
    dC_dt = sp.diff(C, t)
    dC_9 = dC_dt.subs(t, 9)
    
    esperado_dC_9 = sp.Rational(8, 3) * sp.ln(2)
    assert sp.simplify(dC_9 - esperado_dC_9) == 0
    print(f"Afirmação II verificada: C'(9) = {dC_9} = (8/3)*ln(2)")
    
    # III. Com um mês (30 dias), C(30) > 1000
    val_30 = C.subs(t, 30)
    # 2^(30/3) = 2^10 = 1024
    assert val_30 == 1024
    assert val_30 > 1000
    print(f"Afirmação III verificada: C(30) = {val_30} > 1000")
    
    print("\nConclusão: Todas as afirmações (I, II e III) são verdadeiras -> Alternativa E.")

if __name__ == '__main__':
    verificar_q009()
