import sympy as sp

x = sp.symbols("x")
g = (2*x**2 - 7*x + 3) / (x - 2)
print("fatoração do numerador:", sp.factor(2*x**2 - 7*x + 3))
print("valor do numerador em x = 2:", (2*x**2 - 7*x + 3).subs(x, 2))
print("limite lateral pela esquerda:", sp.limit(g, x, 2, dir="-"))
print("limite lateral pela direita:", sp.limit(g, x, 2, dir="+"))
print("g(0) =", g.subs(x, 0), "| zeros de g:", sp.solve(sp.Eq(2*x**2 - 7*x + 3, 0), x))
