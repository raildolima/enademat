from fractions import Fraction

VELOCIDADE_SOM = Fraction(343)           # m/s
DISTANCIA_ALARME = Fraction(175, 100)    # 1,75 m
percurso = 2 * DISTANCIA_ALARME          # ida e volta, m
tempo = percurso / VELOCIDADE_SOM        # s

alternativas = {
    "A": Fraction(1, 196),
    "B": Fraction(1, 98),
    "C": Fraction(5, 98),
    "D": Fraction(5, 49),
}
print(f"percurso ida e volta={percurso} m | tempo={tempo} s = {float(tempo):.6f} s")
print("coincidem:", [k for k, v in alternativas.items() if v == tempo])
