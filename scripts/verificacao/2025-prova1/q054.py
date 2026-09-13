"""
Verificação geométrica da Questão 54 do ENADE 2025 (Prova 1).
Calcula as dimensões em escala 1:500 e o volume da maquete da pirâmide do Hotel Luxor.
"""

# Dimensões reais:
H_real_m = 110.0
L_real_m = 220.0
escala = 500.0

# Conversão para centímetros reais:
H_real_cm = H_real_m * 100.0 # 11000 cm
L_real_cm = L_real_m * 100.0 # 22000 cm

# Dimensões da maquete:
h_maquete_cm = H_real_cm / escala # 22 cm
l_maquete_cm = L_real_cm / escala # 44 cm

# Volume da maquete:
area_base = l_maquete_cm ** 2 # 44 * 44 = 1936 cm^2
volume_maquete_cm3 = (1.0 / 3.0) * area_base * h_maquete_cm

print(f"Altura real: {H_real_m} m = {H_real_cm} cm")
print(f"Aresta da base real: {L_real_m} m = {L_real_cm} cm")
print(f"Altura da maquete: {h_maquete_cm:.2f} cm")
print(f"Aresta da base da maquete: {l_maquete_cm:.2f} cm")
print(f"Área da base da maquete: {area_base:.2f} cm^2")
print(f"Volume da maquete: {volume_maquete_cm3:.2f} cm^3")

assert abs(h_maquete_cm - 22.0) < 1e-5
assert abs(l_maquete_cm - 44.0) < 1e-5
assert abs(volume_maquete_cm3 - 14197.33) < 0.01

print("\nConclusão: Altura = 22 cm, Aresta da base = 44 cm, Volume = 14.197,33 cm^3 (Alternativa A).")
