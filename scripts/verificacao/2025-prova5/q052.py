"""
Verificação formal da Questão 52 - ENADE 2025 Prova 5
Classificação de sequências: Perímetros (PA) e Áreas (nem PA nem PG).
"""

def verificar_pa_pg():
    # Lados dos quadrados: 1, 2, 3, 4 cm
    lados = [1, 2, 3, 4]
    
    perimetros = [4 * l for l in lados]  # [4, 8, 12, 16]
    areas = [l**2 for l in lados]        # [1, 4, 9, 16]
    
    # 1. Teste de PA nos perímetros:
    dif_perimetros = [perimetros[i+1] - perimetros[i] for i in range(len(perimetros)-1)]
    assert all(d == dif_perimetros[0] for d in dif_perimetros)
    razao_pa = dif_perimetros[0]
    assert razao_pa == 4
    
    # 2. Teste de PA nas áreas:
    dif_areas = [areas[i+1] - areas[i] for i in range(len(areas)-1)]
    eh_pa_areas = all(d == dif_areas[0] for d in dif_areas)
    assert not eh_pa_areas  # dif_areas = [3, 5, 7]
    
    # 3. Teste de PG nas áreas:
    razoes_areas = [areas[i+1] / areas[i] for i in range(len(areas)-1)]
    eh_pg_areas = all(r == razoes_areas[0] for r in razoes_areas)
    assert not eh_pg_areas  # razoes_areas = [4.0, 2.25, 1.777...]
    
    print("Sequência dos perímetros:", perimetros)
    print("Diferenças consecutivas dos perímetros:", dif_perimetros, "=> É PA de razão 4.")
    print("Sequência das áreas:", areas)
    print("Diferenças consecutivas das áreas:", dif_areas, "=> NÃO É PA.")
    print("Razões consecutivas das áreas:", razoes_areas, "=> NÃO É PG.")
    print("Alternativa correta confirmada: C")

if __name__ == "__main__":
    verificar_pa_pg()
