from sympy import factorint, Mul, Integer, primerange

# Fatorações citadas nas alternativas
for n in [120, 180, 144, 210, 343, 36, 323, 23707, 31, 101]:
    print(f"{n} = {factorint(n)}")

# Representações de 36 citadas na alternativa C
for par in [(6, 6), (4, 9), (3, 12)]:
    print(f"36 = {par[0]} x {par[1]} -> produto {par[0] * par[1]}")

# Alternativa D: 151 x 157 e 17 x 19 são compostos; 31 e 101 são primos
print("151 x 157 =", 151 * 157, factorint(151 * 157))
print("17 x 19 =", 17 * 19, factorint(17 * 19))
print("31 primo?", factorint(31) == {31: 1}, "| 101 primo?", factorint(101) == {101: 1})
print("primos ate 20:", list(primerange(2, 20)))
