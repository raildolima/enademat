"""
Verificação probabilística da Questão 49 do ENADE 2025 (Prova 1).
Demonstra o erro da regra ingênua P(A ou B) = P(A) + P(B) quando A e B não são disjuntos.
"""

# Espaço amostral do lançamento de um dado de 6 faces:
omega = {1, 2, 3, 4, 5, 6}
n_omega = len(omega)

# Eventos da Alternativa D:
# A: face ímpar
A = {1, 3, 5}
# B: número primo
B = {2, 3, 5}

# Probabilidades individuais:
P_A = len(A) / n_omega # 3/6 = 0.5
P_B = len(B) / n_omega # 3/6 = 0.5

# Soma ingênua P(A) + P(B):
soma_ingenua = P_A + P_B # 1.0 (100%)

# Interseção e União reais:
intersecao = A.intersection(B) # {3, 5}
uniao = A.union(B)             # {1, 2, 3, 5}

P_intersecao = len(intersecao) / n_omega # 2/6 = 1/3
P_uniao_real = len(uniao) / n_omega      # 4/6 = 2/3

print("=== Análise dos eventos da Alternativa D ===")
print(f"Evento A (ímpar): {A} -> P(A) = {P_A}")
print(f"Evento B (primo): {B} -> P(B) = {P_B}")
print(f"Soma ingênua P(A) + P(B): {soma_ingenua:.2f} (100%)")
print(f"Interseção A inter B: {intersecao} -> P(A inter B) = {P_intersecao:.4f}")
print(f"União real A união B: {uniao} -> P(A união B) = {P_uniao_real:.4f} (66,7%)")
print(f"Diferença (erro da regra ingênua): {soma_ingenua - P_uniao_real:.4f}")

assert soma_ingenua != P_uniao_real, "Deveria ser diferente para servir de contraexemplo!"
print("\nConclusão: a Alternativa D é um contraexemplo direto e eficaz.")
