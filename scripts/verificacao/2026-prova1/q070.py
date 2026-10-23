# Q70 - equipe de cada posicao: ((p - 1) mod 6) + 1, equivalente a p mod 6 com resto 0 -> equipe 6.

def equipe(p):
    return ((p - 1) % 6) + 1

alternativas = {
    "A": ([213, 297, 384], 3),
    "B": ([126, 306, 416], 6),
    "C": ([130, 208, 436], 4),
    "D": ([105, 150, 510], 5),
}
verdadeiras = []
for letra, (posicoes, equipe_afirmada) in alternativas.items():
    reais = [equipe(p) for p in posicoes]
    ok = all(r == equipe_afirmada for r in reais)
    print(f"{letra}) posicoes {posicoes} -> equipes {reais} (afirmada {equipe_afirmada}) -> {'VERDADEIRA' if ok else 'falsa'}")
    if ok:
        verdadeiras.append(letra)
print("alternativa(s) verdadeira(s):", verdadeiras)
