import sympy as sp

x = sp.symbols("x")
f = (x**3 + x**2 - 6*x) / (x - 2)
print("fatoração do numerador:", sp.factor(x**3 + x**2 - 6*x))
print("f simplificada (x != 2):", sp.factor(sp.cancel(f)))
print("limite de f em x -> 2:", sp.limit(f, x, 2))
