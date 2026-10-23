from math import gcd
from sympy import factorint


def numero(fat):
    n = 1
    for p, e in fat.items():
        n *= p ** e
    return n


def mdc_mmc(a, b):
    return gcd(a, b), a * b // gcd(a, b)


alvo_mdc = {31: 1, 43: 1, 103: 1}
alvo_mmc = {31: 2, 43: 1, 103: 3, 157: 1}
mdc_esperado = numero(alvo_mdc)
mmc_esperado = numero(alvo_mmc)
print("mdc alvo =", mdc_esperado, factorint(mdc_esperado))
print("mmc alvo =", mmc_esperado, factorint(mmc_esperado))

opcoes = {
    "A": ({31: 2, 103: 1, 157: 1}, {31: 1, 43: 1, 103: 3}),
    "B": ({31: 1, 43: 1, 103: 1}, {31: 2, 43: 1, 103: 3, 157: 1}),
    "C": ({31: 2, 43: 1, 103: 3}, {31: 1, 43: 1, 103: 2}),
    "D": ({31: 2, 43: 1, 103: 1, 157: 1}, {31: 1, 43: 1, 103: 3, 157: 1}),
}

for letra, (fa, fb) in opcoes.items():
    a, b = numero(fa), numero(fb)
    mdc, mmc = mdc_mmc(a, b)
    ok = mdc == mdc_esperado and mmc == mmc_esperado
    print(f"{letra}: a={a} b={b} mdc={mdc} mmc={mmc} -> {'ATENDE' if ok else 'nao atende'}")
