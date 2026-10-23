from fractions import Fraction as F

soma = F(2, 4) + F(1, 3)          # 5/6 = 10/12
dif = F(2, 4) - F(1, 3)           # 1/6 = 2/12
joao = F(2, 6)                    # resposta de João

print(f"2/4 + 1/3 = {soma} = {soma.numerator * 2}/{soma.denominator * 2}")
print(f"2/4 - 1/3 = {dif} = {dif.numerator * 2}/{dif.denominator * 2}")
print(f"resposta de João 2/6 = {joao}; 2/6 < 1/2: {joao < F(1, 2)}; soma > 1/2: {soma > F(1, 2)}")
print("João errou (2/6 != 5/6):", joao != soma)
print("10/12 == 5/6:", F(10, 12) == soma, "| 2/12 == 1/6:", F(2, 12) == dif)
