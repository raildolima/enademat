import math
from fractions import Fraction

precipitacao_m = Fraction(120, 1000)     # 120 mm = 0,120 m de lâmina d'água
area_m2 = 5000                           # área impermeabilizada
volume_chuva = precipitacao_m * area_m2  # m³

base_maior, base_menor, altura_trap, altura_modulo = 8, 4, 3, 1
area_trapezio = Fraction((base_maior + base_menor) * altura_trap, 2)  # m²
volume_modulo = area_trapezio * altura_modulo                         # m³

n_exato = volume_chuva / volume_modulo
n_min = math.ceil(n_exato)
alternativas = {"A": 17, "B": 25, "C": 34, "D": 50}

print(f"volume da chuva={volume_chuva} m³ | área do trapézio={area_trapezio} m² | volume do módulo={volume_modulo} m³")
print(f"n exato={n_exato} = {float(n_exato):.4f} -> mínimo inteiro {n_min}")
print(f"capacidade com 33 módulos={33 * volume_modulo} m³ (< {volume_chuva}) | com 34={34 * volume_modulo} m³ (>= {volume_chuva})")
print("coincidem:", [k for k, v in alternativas.items() if v == n_min])
