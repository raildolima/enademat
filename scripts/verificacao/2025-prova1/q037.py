"""
Verificação algébrica e computacional da Questão 37 do ENADE 2025 (Prova 1).
Calcula K^(-1), M = K^(-1) * C e decifra a mensagem original.
"""

import sympy as sp

# Definindo a matriz-chave K
K = sp.Matrix([
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1]
])

# Determinante de K
det_K = K.det()
print(f"Determinante de K: {det_K}")
assert det_K != 0, "K não é inversível!"

# Inversa de K
K_inv = K.inv()
print("K^(-1):")
sp.pprint(K_inv)

# Matriz codificada C (3x6)
C = sp.Matrix([
    [49, 37, 35, 25, 25, 11],
    [31, 50, 26, 38, 15,  1],
    [36, 41, 29, 25, 36, 10]
])

# Calculando M = K^(-1) * C
M = K_inv * C
print("\nMatriz M decifrada (3x6):")
sp.pprint(M)

# Tabela de decodificação inversa:
# a = 26, b = 25, ..., z = 1, espaço = 0
# Se valor == 0 -> ' '
# Se 1 <= valor <= 26 -> chr(ord('a') + 26 - valor)
def num_para_char(n):
    n = int(n)
    if n == 0:
        return ' '
    elif 1 <= n <= 26:
        return chr(ord('a') + (26 - n))
    else:
        return f"[{n}]"

# Ler os números da matriz M (por linha ou por coluna?)
# Vamos testar por linha:
letras_linha = [num_para_char(val) for val in M]
texto_linha = "".join(letras_linha)
print(f"\nTexto lido por linhas: '{texto_linha}'")

# Testar por colunas:
letras_coluna = []
for c in range(M.cols):
    for r in range(M.rows):
        letras_coluna.append(num_para_char(M[r, c]))
texto_coluna = "".join(letras_coluna)
print(f"Texto lido por colunas: '{texto_coluna}'")

# Verificação teórica da questão:
# Como C = K * M, e K é 3x3 e C é 3x6:
# Multiplicando à esquerda por K^(-1):
# K^(-1) * C = K^(-1) * (K * M) = (K^(-1) * K) * M = I_3 * M = M.
# Portanto, a alternativa correta é multiplicar a inversa de K por C (Alternativa D).
print("\nConclusão da questão: multiplicar K^(-1) por C (Alternativa D).")
