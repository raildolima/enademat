# Senha: número 108 representado com algarismos de 0 a 5 em alguma base.
# Testa cada alternativa: os algarismos precisam ser válidos na base indicada.
alternativas = {
    "A": ("300", 6),
    "B": ("044", 8),
    "C": ("412", 5),
    "D": ("312", 7),
}

for letra, (digitos, base) in alternativas.items():
    valido = all(int(d) < base for d in digitos)
    valor = int(digitos, base)
    print(f"{letra}: {digitos} na base {base} = {valor} | algarismos válidos na base: {valido} | vale 108: {valido and valor == 108}")
