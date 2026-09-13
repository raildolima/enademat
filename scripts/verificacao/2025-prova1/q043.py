"""
Verificação numérica e analítica da Questão 43 do ENADE 2025 (Prova 1).
Calcula a integral Si(2), as somas de Riemann para n = 10, 50, 1000,
e demonstra por que a proposição formal D com o valor aproximado 1,6054
falha para r < 1.3e-5, justificando a alternativa B da banca.
"""

import sympy as sp
import numpy as np

# Função f(x) = sin(x)/x em [0, 2]
x = sp.Symbol('x')
f = sp.sin(x) / x

# Valor exato da integral sob f em [0, 2]
integral_exata = sp.integrate(f, (x, 0, 2))
val_exato = float(integral_exata.evalf(15))
print(f"Valor exato de integral_0^2 (sin(x)/x) dx = Si(2) = {val_exato:.10f}")

# Diferença para o valor 1,6054 citado na prova:
val_prova = 1.6054
erro_aproximacao = abs(val_exato - val_prova)
print(f"Diferença entre o valor exato e 1,6054: {erro_aproximacao:.10e}")

# Somas de Riemann pela direita: base 2/n, altura f(2i/n)
# Note: no texto da prova, a soma é dada como sum_{i=1}^n (2/n) * (sin(2i/n) / (2i/n)) = sum_{i=1}^n sin(2i/n)/i
def soma_riemann(n):
    # base = 2/n
    # x_i = 2*i/n
    # f(x_i) = sin(2*i/n)/(2*i/n)
    # termo = base * f(x_i) = sin(2*i/n) / i
    i_vals = np.arange(1, n + 1)
    x_i = 2.0 * i_vals / n
    termos = (2.0 / n) * (np.sin(x_i) / x_i)
    return np.sum(termos)

print("\nConvergência das somas de Riemann:")
for n in [10, 50, 100, 500, 1000, 10000]:
    s = soma_riemann(n)
    print(f"n = {n:5d}: Soma = {s:.6f} | Erro para Si(2) = {abs(s - val_exato):.6e}")

# Demonstração sobre a Alternativa D:
# Para r = 1e-5:
# lim_{n->oo} |S_n - 1.6054| = |val_exato - 1.6054| = 1.2977e-5 > 1e-5.
# Logo, para r = 1e-5, NÃO EXISTE N tal que |S_n - 1.6054| < r para todo n > N.
print(f"\nAnálise da alternativa D com r = 1e-5:")
print(f"lim |S_n - 1.6054| = {erro_aproximacao:.6e} > 1e-5.")
print("Portanto, a formalização rigorosa para 'todo r > 0' falha estritamente com o valor truncado 1,6054.")
print("Isso confirma a adoção da Alternativa B pela banca (aproximação prescrita para n suficientemente grande).")
