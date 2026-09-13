"""Verificação da Questão 78 - ENADE 2025 Prova 1.
Cálculo de geração energética a partir de resíduos sólidos.
L = 200 toneladas (em agosto de 2026)
Taxa de reaproveitamento = 1%
Rendimento energético = 600 kWh/tonelada/dia
Consumo diário = 3000 kWh/dia
"""

def test_q078():
    L = 200.0  # toneladas
    taxa = 0.01
    lixo_reaproveitado = L * taxa  # 2 toneladas
    
    geracao_por_ton = 600.0  # kWh / dia
    energia_gerada = lixo_reaproveitado * geracao_por_ton  # 1200 kWh / dia
    
    consumo_diario = 3000.0  # kWh / dia
    percentual_suprido = (energia_gerada / consumo_diario) * 100.0
    
    print(f"Lixo reaproveitado: {lixo_reaproveitado} toneladas")
    print(f"Energia gerada: {energia_gerada} kWh/dia")
    print(f"Percentual do consumo suprido: {percentual_suprido}%")
    
    assert lixo_reaproveitado == 2.0
    assert energia_gerada == 1200.0
    assert percentual_suprido == 40.0
    
    print("Verificação energética de Q78 concluída com 100% de precisão!")

if __name__ == "__main__":
    test_q078()
