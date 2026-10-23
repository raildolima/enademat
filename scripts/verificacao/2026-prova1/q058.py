from fractions import Fraction as F

A = (F(-3), F(-6))
D = (F(5), F(10))
AD = (D[0] - A[0], D[1] - A[1])                       # vetor AD = (8, 16)
DP = (AD[0] * F(1, 4), AD[1] * F(1, 4))               # vetor DP' = (2, 4)
P = (D[0] + DP[0], D[1] + DP[1])                      # P' = (7, 14)
print(f"AD={AD} | DP'={DP} | P'={P}")
alternativas = {"A": (-5, -10), "B": (-1, -2), "C": (3, 6), "D": (7, 14)}
print("coincidem:", [k for k, v in alternativas.items() if (F(v[0]), F(v[1])) == P])
