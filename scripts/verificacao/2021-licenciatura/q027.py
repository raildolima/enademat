"""
Verificação algébrica e aritmética da Questão 27 - ENADE 2021 Matemática Licenciatura
Problema do colar de pérolas: x/6 + x/3 + x/10 + 6 = x
"""
import sympy as sp

def verificar_q027():
    x = sp.Symbol('x', real=True)
    # Equação: x/6 + x/3 + x/10 + 6 = x
    eq = sp.Eq(x/6 + x/3 + x/10 + 6, x)
    solucao = sp.solve(eq, x)
    print("Solução algébrica da equação:", solucao)
    
    val_x = solucao[0]
    assert val_x == 15
    
    # Verificação física de pérolas (devem ser números naturais):
    perolas_solo = val_x / 6      # 15 / 6 = 2.5
    perolas_jovem1 = val_x / 3    # 15 / 3 = 5
    perolas_jovem2 = val_x / 10   # 15 / 10 = 1.5
    
    print(f"Pérolas ao solo: {perolas_solo}")
    print(f"Pérolas jovem 1: {perolas_jovem1}")
    print(f"Pérolas jovem 2: {perolas_jovem2}")
    
    # As pérolas não podem ser fracionárias!
    assert perolas_solo != int(perolas_solo)
    assert perolas_jovem2 != int(perolas_jovem2)
    print("Incoerência com o enunciado: 2,5 e 1,5 não são inteiros -> Asserção I é VERDADEIRA.")
    
    # Condição para que x/6, x/3 e x/10 sejam inteiros:
    # x deve ser múltiplo de 6, 3 e 10 (múltiplo de mmc(6, 3, 10) = 30).
    print("Asserção II é VERDADEIRA: A quantidade total de pérolas deve ser divisível por 3, por 6 e por 10.")
    print("A asserção II é a justificativa exata da asserção I -> Alternativa A.")

if __name__ == '__main__':
    verificar_q027()
