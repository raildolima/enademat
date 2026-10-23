from fractions import Fraction

# Texto 2: P(chuva) = 1/2; P(florescer | chuva) = 4/5 (0,80); P(florescer | não chuva) = 1/10 (0,10)
p_chuva = Fraction(50, 100)
p_flor_chuva = Fraction(80, 100)
p_flor_seca = Fraction(10, 100)

p_flor = p_chuva * p_flor_chuva + (1 - p_chuva) * p_flor_seca   # teorema da probabilidade total
p_chuva_flor = p_chuva * p_flor_chuva / p_flor                  # Bayes
print(f"P(florescer)={p_flor} | P(chover | florescer)={p_chuva_flor} = {float(p_chuva_flor):.4f}")
alternativas = {"A": Fraction(1, 2), "B": Fraction(4, 5), "C": Fraction(4, 9), "D": Fraction(8, 9)}
print("coincidem:", [k for k, v in alternativas.items() if v == p_chuva_flor])
