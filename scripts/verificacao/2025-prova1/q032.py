from fractions import Fraction
from math import isqrt

bc_cm = isqrt(25**2 - 20**2)                 # 15
ab_m, bc_m = 20 * 20, bc_cm * 20             # 400, 300
area_m2 = Fraction(ab_m * bc_m, 2)           # 60000
c0_mg = 120 * area_m2                        # 7200000
alternativas = {"A": 1.44e7, "B": 7.2e5, "C": 1.44e6, "D": 7.2e6}
print(f"BC={bc_cm} cm | área={area_m2} m² | C0={c0_mg} mg")
print("coincidem:", [k for k, v in alternativas.items() if abs(v - float(c0_mg)) < 1e-9 * float(c0_mg)])
