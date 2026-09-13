"""Verificação da Questão 79 - ENADE 2025 Prova 1.
Pantógrafo articulado:
Razão de ampliação k = 4 : 1 (k = 4)
Relações do pantógrafo:
  BF = BL1 = AC
  AB = CL1 = CL2
  k = (AB + BF) / BF = (AB / BF) + 1
"""

def test_q079():
    # Caso 1 do texto: BF = AB -> k = (1 + 1) = 2 (razão 2:1)
    k_1 = (1 + 1) / 1
    assert k_1 == 2.0
    
    # Caso 2 do texto: 2BF = AB (AB/BF = 2) -> k = (2 + 1) = 3 (razão 3:1)
    k_2 = (2 + 1) / 1
    assert k_2 == 3.0
    
    # Caso desejado pelo grupo: ampliação na razão de 4 : 1 (k = 4)
    # k = (AB / BF) + 1 = 4 => AB / BF = 3 => AB = 3BF (ou 3BF = AB)
    k_desejado = 4.0
    razao_hastes = k_desejado - 1  # AB / BF = 3
    print(f"Razão necessária AB / BF: {razao_hastes}")
    assert razao_hastes == 3.0
    
    # Alternativa B indica 3BF = AB
    print("Verificação do pantógrafo articulado de Q79 concluída com 100% de sucesso!")

if __name__ == "__main__":
    test_q079()
