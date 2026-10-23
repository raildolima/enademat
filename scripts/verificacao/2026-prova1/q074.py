from fractions import Fraction

base_m = 190                       # base do cone acima do nível do mar
topo_m = 590                       # topo, conforme texto-base
h = topo_m - base_m                # altura do cone = 400 m
diametro = 10 * h                  # diâmetro da base = 10·h = 4000 m
r = Fraction(diametro, 2)          # raio = 2000 m
pi = 3                             # aproximação pedida
volume = Fraction(1, 3) * pi * r**2 * h
densidade = 3000                   # kg/m³ (texto-base)
massa = densidade * volume
print(f"h = {h} m | r = {r} m | V = {volume} m³ | massa = {massa} kg = {float(massa):.3e} kg")

alternativas = {"A": 4.8e12, "B": 1.44e13, "C": 1.54e13, "D": 1.92e13}
print("coincidem:", [k for k, v in alternativas.items() if abs(v - float(massa)) < 1e-9 * float(massa)])
# erro típico: usar 590 m como altura E como base do diâmetro (10·590 = 5900 m)
erro_c = Fraction(1, 3) * pi * (Fraction(10 * topo_m, 2)) ** 2 * topo_m * densidade
print(f"erro com h = 590 m no diâmetro e na altura (alternativa C?): {float(erro_c):.3e} kg")
erro_b = Fraction(1, 1) * pi * r**2 * h * densidade          # esquece o fator 1/3
erro_d = Fraction(1, 3) * pi * (2 * r) ** 2 * h * densidade  # usa o diâmetro como raio
print(f"erro B (sem 1/3): {float(erro_b):.3e} kg | erro D (diâmetro como raio): {float(erro_d):.3e} kg")
