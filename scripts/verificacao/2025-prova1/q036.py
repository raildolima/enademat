"""
Verificação numérica da Questão 36 do ENADE 2025 (Prova 1).
Testa a divisibilidade dos números pelos divisores 2, 3, 5 e 9,
além de calcular a soma dos dígitos para 3 e 9.
"""

numeros = [126, 845, 1020, 371, 999]
divisores = [2, 3, 5, 9]

print("=== Verificação da Questão 36 ===")
for n in numeros:
    soma_digitos = sum(int(d) for d in str(n))
    divisiveis = [d for d in divisores if n % d == 0]
    print(f"Número: {n:4d} | Soma dos dígitos: {soma_digitos:2d} | Divisível por: {divisiveis}")

# Verificações conceituais específicas
print("\nVerificação dos erros citados pela IA:")
print(f"126 termina em 6 (múltiplo de 3). Mas 16 termina em 6 e 16 % 3 = {16 % 3} (NÃO é divisível por 3!).")
print(f"999 termina em 9. Mas 19 termina em 9 e 19 % 9 = {19 % 9} (NÃO é divisível por 9!).")
print("Portanto, a justificativa por terminação para 3 e 9 é falsa.")
