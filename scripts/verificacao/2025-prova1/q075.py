"""Verificação da Questão 75 - ENADE 2025 Prova 1.
Escalas e distâncias cartográficas:
- Mapa A: d_A = 6.5 cm, Escala = 1 : 38 000 000
- Mapa B: d_B = 3.0 cm, Escala desconhecida
"""

def test_q075():
    d_A = 6.5  # cm
    E_A_inv = 38_000_000
    
    # Distância real D em cm
    D_cm = d_A * E_A_inv
    # Conversão para km: 1 km = 100 000 cm
    D_km = D_cm / 100_000
    print(f"Distância real calculada: {D_km} km")
    assert D_km == 2470.0, f"Esperado 2470 km, obtido {D_km}"
    
    # Escala do Mapa B
    d_B = 3.0  # cm
    E_B_inv = D_cm / d_B
    print(f"Denominador da escala do Mapa B: {E_B_inv:.2f}")
    assert abs(E_B_inv - 82_333_333.33) < 1.0
    
    # Arredondamento para escala comercial aproximada
    escala_aprox = round(E_B_inv, -5)  # arredonda para centenas de milhar
    print(f"Escala aproximada comercial do Mapa B: 1 : {escala_aprox}")
    assert escala_aprox == 82_300_000
    
    print("Verificação de escalas e distâncias de Q75 concluída com sucesso!")

if __name__ == "__main__":
    test_q075()
