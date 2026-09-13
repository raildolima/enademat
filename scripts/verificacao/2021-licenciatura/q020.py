"""
Verificação simbólica da Questão 20 - ENADE 2021 Matemática Licenciatura
Equações Diferenciais Ordinárias (EDO): Modelo de capitalização contínua dS/dt = r*S + k
"""
import sympy as sp

def verificar_q020():
    t = sp.Symbol('t', real=True)
    r = sp.Symbol('r', real=True, positive=True)
    k = sp.Symbol('k', real=True)
    S0 = sp.Symbol('S0', real=True, positive=True)
    S = sp.Function('S')
    
    # EDO: dS/dt = r*S + k <=> dS/dt - r*S = k
    edo = sp.Eq(S(t).diff(t), r*S(t) + k)
    
    # I. É uma EDO linear de primeira ordem
    # Classificação pelo SymPy:
    classificacao = sp.classify_ode(edo, S(t))
    print("Classificação da EDO pelo SymPy:", classificacao)
    assert 'separable' in classificacao
    assert any('linear' in c for c in classificacao)
    print("Afirmação I: Verdadeira. EDO linear de 1ª ordem.")
    
    # II. Solubilidade analítica com parâmetros literais r e k
    sol_geral = sp.dsolve(edo, S(t))
    print("Solução geral analítica:", sol_geral)
    # A equação é perfeitamente solúvel analiticamente.
    print("Afirmação II: Falsa. A presença de parâmetros literais não impede a resolução analítica.")
    
    # III. Caso k = 0 e condição inicial S(0) = S0
    edo_k0 = sp.Eq(S(t).diff(t), r*S(t))
    sol_k0 = sp.dsolve(edo_k0, S(t), ics={S(0): S0})
    print("Solução com k=0 e S(0)=S0:", sol_k0)
    
    esperado_k0 = S0 * sp.exp(r*t)
    assert sp.simplify(sol_k0.rhs - esperado_k0) == 0
    print("Afirmação III: Verdadeira. S(t) = S0 * e^(rt).")
    
    print("\nConclusão: Afirmações corretas I e III -> Alternativa C.")

if __name__ == '__main__':
    verificar_q020()
