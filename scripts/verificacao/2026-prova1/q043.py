# Nunca 7: cada ordem vale 7 vezes a anterior (tampinha = 1, copo = 7, prato = 49).
BASE = 7


def valor(pratos, copos, tampinhas, base=BASE):
    return pratos * base**2 + copos * base + tampinhas


a = valor(2, 1, 3)                 # estudante A: 2 pratos, 1 copo, 3 tampinhas
b = valor(1, 6, 6)                 # estudante B: 1 prato, 6 copos, 6 tampinhas
print(f"A (base 7) = {a} na base 10 | B (base 7) = {b} na base 10")
print("vencedor:", "A" if a > b else "B")

# Leituras incorretas que correspondem às alternativas
print("B lido na base 10 (166):", valor(1, 6, 6, base=10))
print("B desprezando as 6 tampinhas (91):", 1 * 49 + 6 * 7)

alternativas = {"A": (42, "A"), "B": (108, "A"), "C": (91, "B"), "D": (166, "B")}
corretas = [k for k, (v, e) in alternativas.items() if e == ("A" if a > b else "B") and v == max(a, b)]
print("alternativa com o estudante vencedor e o valor correto:", corretas)
