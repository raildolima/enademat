from fractions import Fraction


def area_jorge(a, b, c, d):
    # quadrado da quarta parte da soma dos lados
    return (Fraction(a + b + c + d, 4)) ** 2


def area_adao(a, b, c, d):
    # produto das médias dos pares de lados opostos
    return Fraction(a + c, 2) * Fraction(b + d, 2)


# Retângulo 10 x 4: lados a=10, b=4, c=10, d=4
ret = (10, 4, 10, 4)
print("retangulo 10x4 real = 40")
print("  Jorge =", area_jorge(*ret), "| Adao =", area_adao(*ret))
print("  lados do retangulo de Adao:", Fraction(10 + 10, 2), "x", Fraction(4 + 4, 2))

# Quadrado 5 x 5
quad = (5, 5, 5, 5)
print("quadrado 5x5 real = 25")
print("  Jorge =", area_jorge(*quad), "| Adao =", area_adao(*quad))

# Quadrilátero geral: a=12, b=7, c=9, d=5
geral = (12, 7, 9, 5)
print("quadrilatero geral (12,7,9,5)")
print("  Jorge =", area_jorge(*geral), "| Adao =", area_adao(*geral))
print("  lados de Adao:", Fraction(12 + 9, 2), "x", Fraction(7 + 5, 2),
      "| Adao e quadrado?", Fraction(12 + 9, 2) == Fraction(7 + 5, 2))
