"""Verificação da Questão 31 - ENADE 2025 Prova 5.
Aritmética hexadecimal (base 16):
(B7 + A)_16
"""

def test_q031():
    # Em base 16:
    val_b7 = int("B7", 16)
    val_a = int("A", 16)
    
    print(f"B7_16 em base decimal: {val_b7}")
    print(f"A_16 em base decimal: {val_a}")
    
    soma_dec = val_b7 + val_a
    soma_hex = hex(soma_dec)[2:].upper()
    
    print(f"Soma decimal: {soma_dec}")
    print(f"Soma hexadecimal: {soma_hex}")
    
    assert val_b7 == 11 * 16 + 7  # 183
    assert val_a == 10
    assert soma_dec == 193
    assert soma_hex == "C1"
    
    # Conferir exemplos dados no texto-base:
    # (E + C4)_16 = D2_16
    assert hex(int("E", 16) + int("C4", 16))[2:].upper() == "D2"
    # (D - 7)_16 = 6_16
    assert hex(int("D", 16) - int("7", 16))[2:].upper() == "6"
    
    print("Verificação da aritmética hexadecimal de Q31 concluída com 100% de sucesso!")

if __name__ == "__main__":
    test_q031()
