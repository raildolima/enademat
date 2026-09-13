"""
Verificação formal da Questão 47 - ENADE 2025 Prova 5
Numeração Babilônica Sexagesimal e Tabela de Multiplicação.
"""
import sympy as sp

def verificar_multiplicacao_babilonica():
    # Coluna I: 8 cravos = 8
    val_col1 = 8
    
    # Coluna II: 1 cravo na ordem sexagesimal superior (60^1)
    # 1 asna (< = 10) e 2 cravos (v v = 2) na ordem das unidades (60^0)
    ordem_superior = 1 * 60
    ordem_unidades = 10 + 2  # 12
    val_col2 = ordem_superior + ordem_unidades
    assert val_col2 == 72, f"Valor incorreto na coluna II: {val_col2}"
    
    # Fator de multiplicação:
    k = val_col2 // val_col1
    resto = val_col2 % val_col1
    assert resto == 0
    assert k == 9
    
    print(f"Coluna I (decimal): {val_col1}")
    print(f"Coluna II (decimal): {val_col2} (1*60 + 12)")
    print(f"Fator multiplicador: {k}")
    print("Alternativa correta confirmada: A")

if __name__ == "__main__":
    verificar_multiplicacao_babilonica()
