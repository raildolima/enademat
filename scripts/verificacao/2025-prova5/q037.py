"""
Verificação formal da Questão 37 - ENADE 2025 Prova 5
Cálculo exato e aplicação da propriedade distributiva da multiplicação.
"""

def verificar_calculo_estudante():
    # Decomposição do estudante:
    # 740 = 640 + 100
    # 27 = 26 + 1
    # (640 + 100) * (26 + 1) = 640*26 + 640*1 + 100*26 + 100*1
    p1 = 640 * 26  # 16640
    p2 = 640 * 1   # 640
    soma_1 = p1 + p2  # 17280
    
    p3 = 100 * 26  # 2600
    p4 = 100 * 1   # 100
    soma_2 = p3 + p4  # 2700
    
    # Para evitar digitar 7 (tecla quebrada):
    # 17280 = 16280 + 1000
    # 2700 = 2600 + 100
    total_estudante = 16280 + 1000 + 2600 + 100
    total_esperado = 740 * 27
    
    assert total_estudante == total_esperado == 19980, "Erro no cálculo do estudante"
    
    # Propriedade aplicada: Distributiva da multiplicação sobre a adição:
    # (a + b) * (c + d) = a*c + a*d + b*c + b*d
    print(f"Cálculo do estudante: {total_estudante}")
    print(f"Produto 740 * 27: {total_esperado}")
    print("Natureza do cálculo: EXATO (sem aproximações).")
    print("Propriedade principal: DISTRIBUTIVA da multiplicação.")
    print("Alternativa confirmada: A")

if __name__ == "__main__":
    verificar_calculo_estudante()
