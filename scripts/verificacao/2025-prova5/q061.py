"""
Verificação Numérica da Questão 61 — ENADE 2025 Prova 5 (Componente Específico)
Tema: Matemática Financeira / Viabilidade Econômica de Fontes Sustentáveis
"""

def testar_q061():
    consumo_mensal = 12000 # kWh/mês
    tarifa_atual = 0.50 # R$/kWh
    gasto_atual_mes = consumo_mensal * tarifa_atual # 6000 R$/mês
    gasto_atual_ano = gasto_atual_mes * 12 # 72000 R$/ano

    # Opção Solar:
    geracao_solar = 10000 # kWh/mês
    custo_instalacao = 120000.00 # R$
    economia_mes_solar = geracao_solar * tarifa_atual # 5000 R$/mês
    economia_ano_solar = economia_mes_solar * 12 # 60000 R$/ano
    tempo_quitacao_anos = custo_instalacao / economia_ano_solar # 2 anos
    economia_perc_solar = geracao_solar / consumo_mensal # 83.33%

    assert economia_mes_solar == 5000.0
    assert economia_ano_solar == 60000.0
    assert tempo_quitacao_anos == 2.0, f"Tempo de quitação: {tempo_quitacao_anos}"
    print(f"Solar: Quitado em {tempo_quitacao_anos} anos com economia anual de R$ {economia_ano_solar:.2f}")

    # Opção Eólica:
    tarifa_eolica_base = 0.30 # R$/kWh
    fator_reajuste_ano4 = 1.22 # dado do problema: (1.05)^4
    economia_mes_ano1_eolica = consumo_mensal * (tarifa_atual - tarifa_eolica_base) # 2400 R$/mês
    economia_ano5_eolica = consumo_mensal * 12 * (tarifa_atual - tarifa_eolica_base * fator_reajuste_ano4)

    print(f"Eólica ano 1 economia: R$ {economia_mes_ano1_eolica * 12:.2f}/ano")
    print(f"Eólica ano 5 economia: R$ {economia_ano5_eolica:.2f}/ano")
    assert economia_ano5_eolica < 20000.0, "Economia no ano 5 deve ser menor que 20 mil"
    assert economia_mes_ano1_eolica < economia_mes_solar, "Solar gera maior economia mensal"

    print("Verificação numérica de Q61 concluída com sucesso: Alternativa D confirmada!")

if __name__ == "__main__":
    testar_q061()
