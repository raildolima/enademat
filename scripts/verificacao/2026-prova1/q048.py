from fractions import Fraction


def regime_correto(x):
    # Código Penal, art. 33, § 2º (trecho do Texto 1)
    if x > 8:
        return "fechado"
    if x > 4:
        return "semiaberto"
    return "aberto"


def algoritmo_estudante(x):
    # Sequência do algoritmo apresentada na questão
    if x > 4:
        return "semiaberto"
    if x > 8:
        return "fechado"
    return "aberto"


penas = [Fraction(k, 2) for k in range(0, 25)]  # 0, 0,5, ..., 12
divergencias = [x for x in penas if regime_correto(x) != algoritmo_estudante(x)]

for x in [Fraction(4), Fraction(6), Fraction(8), Fraction(9), Fraction(10)]:
    print(f"x={float(x)}: correto={regime_correto(x)} | estudante={algoritmo_estudante(x)}")
print("penas testadas:", len(penas))
print("divergencias:", [float(x) for x in divergencias])
print("menor pena divergente:", float(min(divergencias)) if divergencias else None)
print("alternativa A (solucao incorreta) coerente:", bool(divergencias))
