"""
Verificação formal da Questão 51 - ENADE 2025 Prova 5
Aumento percentual do tempo de tela: 162 min/dia para 246 min/dia.
"""
from fractions import Fraction

def verificar_aumento_percentual():
    t_inicial = 162
    t_final = 246
    
    delta = t_final - t_inicial
    assert delta == 84
    
    # Fração exata: 84 / 162 = 14 / 27
    frac = Fraction(delta, t_inicial)
    assert frac == Fraction(14, 27)
    
    # Valor decimal e percentual
    pct = float(frac) * 100
    assert 51.8 < pct < 51.9
    
    # Arredondamento para o inteiro mais próximo
    pct_arredondado = round(pct)
    assert pct_arredondado == 52
    
    print(f"Tempo inicial: {t_inicial} min/dia")
    print(f"Tempo final: {t_final} min/dia")
    print(f"Aumento absoluto: {delta} min/dia")
    print(f"Aumento percentual exato: {pct:.4f}%")
    print(f"Aumento percentual aproximado: {pct_arredondado}%")
    print("Alternativa correta confirmada: B (52%)")

if __name__ == "__main__":
    verificar_aumento_percentual()
