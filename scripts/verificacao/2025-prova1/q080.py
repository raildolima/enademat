"""Verificação da Questão 80 - ENADE 2025 Prova 1.
Planta baixa original: 9 cm x 10 cm
Escala da planta original para a casa real: 1 : 150
Pantógrafo triplica (ampliação 3 : 1)
Custo do metro quadrado: R$ 1.800,00
"""

def test_q080():
    largura_desenho_cm = 9.0
    comprimento_desenho_cm = 10.0
    escala = 150.0  # 1 cm no desenho = 150 cm no real = 1.5 m
    
    # Dimensões reais em metros
    largura_real_m = (largura_desenho_cm * escala) / 100.0  # 13.5 m
    comprimento_real_m = (comprimento_desenho_cm * escala) / 100.0  # 15.0 m
    
    print(f"Dimensões reais da casa: {largura_real_m} m x {comprimento_real_m} m")
    assert largura_real_m == 13.5
    assert comprimento_real_m == 15.0
    
    # Área real construída
    area_real_m2 = largura_real_m * comprimento_real_m
    print(f"Área real construída: {area_real_m2} m²")
    assert area_real_m2 == 202.5
    
    # Custo da obra a R$ 1.800,00 por m²
    preco_m2 = 1800.0
    custo_total = area_real_m2 * preco_m2
    print(f"Custo total estimado da obra: R$ {custo_total:,.2f}")
    assert custo_total == 364500.0
    
    # Análise do erro na planta ampliada (marcou 26 cm em vez de 27 cm)
    largura_ampliada_correta = largura_desenho_cm * 3  # 27 cm
    largura_ampliada_incorreta = 26.0
    print(f"Largura ampliada correta: {largura_ampliada_correta} cm (o grupo anotou {largura_ampliada_incorreta} cm)")
    assert largura_ampliada_correta == 27.0
    
    # Se usasse a medida errônea 26 cm:
    largura_erronea_m = (26.0 / 3 * 1.5)  # 13.0 m
    area_erronea_m2 = largura_erronea_m * 15.0  # 195.0 m²
    custo_erroneo = area_erronea_m2 * preco_m2  # R$ 351.000,00 (Alternativa D)
    print(f"Custo com a medida incorreta de 26 cm: R$ {custo_erroneo:,.2f} (distrator D)")
    assert custo_erroneo == 351000.0
    
    print("Verificação de Q80 concluída com 100% de sucesso!")

if __name__ == "__main__":
    test_q080()
