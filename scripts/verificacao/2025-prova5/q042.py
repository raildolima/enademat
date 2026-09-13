"""
Verificação formal da Questão 42 - ENADE 2025 Prova 5
Recorrência da Torre de Hanói: f_{n+1} = 2*f_n + 1, com f_1 = 1.
"""
import sympy as sp

def verificar_torre_hanoi():
    n = sp.Symbol('n', integer=True, positive=True)
    f = sp.Function('f')
    
    # Relação de recorrência: f(n+1) - 2*f(n) - 1 = 0
    recurrence = sp.Eq(f(n + 1), 2 * f(n) + 1)
    
    # Resolução analítica com condição inicial f(1) = 1
    sol = sp.rsolve(recurrence, f(n), {f(1): 1})
    assert sol == 2**n - 1, f"Solução inesperada: {sol}"
    
    # Verificação dos valores fornecidos no enunciado:
    valores_esperados = {1: 1, 2: 3, 3: 7, 4: 15}
    f_val = 1
    for k in range(1, 5):
        assert f_val == valores_esperados[k], f"Valor para n={k} incorreto: {f_val}"
        assert sol.subs(n, k) == valores_esperados[k]
        # Aplicação da recorrência para o próximo termo:
        f_val = 2 * f_val + 1
        
    print(f"Solução fechada da recorrência: f_n = {sol}")
    for k, v in valores_esperados.items():
        print(f"n = {k}: movimentos mínimos = {v}")
    print("Recorrência correta: f_{n+1} = 2*f_n + 1")
    print("Alternativa confirmada: C")

if __name__ == "__main__":
    verificar_torre_hanoi()
