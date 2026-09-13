"""
Verificação da Questão Discursiva 04 - ENADE 2021 Matemática Licenciatura
Análise Real: Convergência de sequências e subsequências pares e ímpares
"""
import sympy as sp

def verificar_d04():
    n = sp.Symbol('n', integer=True, positive=True)
    
    # Exemplo do Item (b): x_n = (-1)^n
    # Subsequência par: x_{2n} = (-1)^(2n) = ((-1)^2)^n = 1^n = 1
    # Subsequência ímpar: x_{2n-1} = (-1)^(2n-1) = -1
    x_n = (-1)**n
    x_par = (-1)**(2*n)
    x_impar = (-1)**(2*n - 1)
    
    lim_par = sp.limit(x_par, n, sp.oo)
    lim_impar = sp.limit(x_impar, n, sp.oo)
    
    print(f"Subsequência par x_{{2n}}: {x_par} -> Limite = {lim_par}")
    print(f"Subsequência ímpar x_{{2n-1}}: {x_impar} -> Limite = {lim_impar}")
    
    assert lim_par == 1
    assert lim_impar == -1
    assert lim_par != lim_impar
    
    # Como lim_par != lim_impar, a sequência x_n não converge.
    # Exemplo válido para o item (b)!
    print("Item (b) verificado: lim x_{2n} existe (=1), mas lim x_n não existe.")
    
    # Verificação de sequência convergente: x_n = 1/n -> lim = 0
    # x_{2n} = 1/(2n) -> lim = 0
    # x_{2n-1} = 1/(2n-1) -> lim = 0
    y_n = 1/n
    y_par = 1/(2*n)
    y_impar = 1/(2*n - 1)
    assert sp.limit(y_n, n, sp.oo) == 0
    assert sp.limit(y_par, n, sp.oo) == 0
    assert sp.limit(y_impar, n, sp.oo) == 0
    print("Item (a) consistente: limites coincidem para sequências convergentes.")

if __name__ == '__main__':
    verificar_d04()
