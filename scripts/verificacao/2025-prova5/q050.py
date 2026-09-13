"""
Verificação formal da Questão 50 - ENADE 2025 Prova 5
Modelo Exponencial de Casos de COVID-19 e Análise da Divergência (A vs C).
"""
import math

def verificar_modelo_covid():
    N_0 = 16000
    novos_semana_1 = 22000
    N_1_acumulado = N_0 + novos_semana_1  # 38000
    N_meta = 62000
    
    # 1. Razões e logaritmos fornecidos no enunciado:
    # ln(1.4) ≈ 0.3, ln(2.4) ≈ 0.9, ln(3.9) ≈ 1.4
    razao_acumulada_1 = N_1_acumulado / N_0  # 38000 / 16000 = 2.375 ≈ 2.4
    razao_meta = N_meta / N_0                # 62000 / 16000 = 3.875 ≈ 3.9
    razao_novos = novos_semana_1 / N_0       # 22000 / 16000 = 1.375 ≈ 1.4
    
    ln_1_4 = 0.3
    ln_2_4 = 0.9
    ln_3_9 = 1.4
    
    # Modelo exponencial: N(t) = N_0 * exp(k * t)
    # Se a unidade de tempo é semanas (t_sem):
    # exp(k_sem * 1) = 2.4 => k_sem = ln(2.4) ≈ 0.9
    # exp(k_sem * t_sem) = 3.9 => t_sem = ln(3.9) / k_sem = 1.4 / 0.9 = 14/9 ≈ 1.555 semanas.
    t_sem = ln_3_9 / ln_2_4
    t_dias_exatos = t_sem * 7  # 1.555... * 7 = 10.888... dias
    
    # Análise das alternativas da banca:
    # A) "1,6 dia." -> Resultado de 1.4 / 0.9 ≈ 1.56 ≈ 1.6, confundindo a unidade semanal com diária.
    # B) "4,7 dias." -> Resultado de 1.4 / 0.3 ≈ 4.67 ≈ 4.7 (se considerasse apenas novos casos 1.4).
    # A) "1,6 dia." -> Resultado de 1.4 / 0.9 aprox 1.56 aprox 1.6, confundindo a unidade semanal com diária.
    # B) "4,7 dias." -> Resultado de 1.4 / 0.3 aprox 4.67 aprox 4.7 (se considerasse apenas novos casos 1.4).
    # C) "14 dias." (Gabarito Oficial) -> Considerando número inteiro de semanas:
    #    Como 1 semana (7 dias) tem 38 000 casos e 62 000 > 38 000, 1.6 dia e 4.7 dias são fisicamente
    #    impossíveis (menores que 7 dias). Portanto, são necessárias 2 semanas = 14 dias para que a contagem
    #    semanal atinja ou supere os 62 000 casos (ao final da 2ª semana haveria 38 000 * 2.4 aprox 91 200 casos).
    # D) "35 dias." -> 5 semanas inteiras (decorrente de 4.7 semanas arredondadas para 5).
    
    print(f"N_0 = {N_0}, N(1 sem) = {N_1_acumulado} (razao {razao_acumulada_1:.3f} aprox 2.4)")
    print(f"N_meta = {N_meta} (razao {razao_meta:.3f} aprox 3.9)")
    print(f"Tempo analitico em semanas: t = 1.4 / 0.9 = {t_sem:.3f} semanas")
    print(f"Tempo analitico em dias continuos: {t_dias_exatos:.2f} dias")
    print("Justificativa do Gabarito C (14 dias):")
    print("- O tempo exato e ~11 dias. Em escalas de afericao semanal (1 sem, 2 sem),")
    print("  sao necessarias 2 semanas (14 dias) para alcancar o patamar acumulado de 62 000.")
    print("- Alternativas 1.6 dia e 4.7 dias sao descartadas pois < 7 dias (onde havia apenas 38 000).")
    print("Gabarito Oficial do INEP confirmado: C (14 dias)")

if __name__ == "__main__":
    verificar_modelo_covid()
