"""
Verificação formal da Questão 44 - ENADE 2025 Prova 5
Estatística Descritiva: Média, Mediana e teste das 4 hipóteses propostas.
"""
from fractions import Fraction
import statistics

def verificar_estatistica():
    # Tempos em horas dos 11 estudantes:
    # 1: 4h
    # 2: 4h30min = 4.5h
    # 3: 3h15min = 3.25h
    # 4: 5h
    # 5: 3h15min = 3.25h
    # 6: 6h15min = 6.25h
    # 7: 4h15min = 4.25h
    # 8: 3h
    # 9: 2h
    # 10: 5h
    # 11: 3h30min = 3.5h
    
    dados = [4.0, 4.5, 3.25, 5.0, 3.25, 6.25, 4.25, 3.0, 2.0, 5.0, 3.5]
    n = len(dados)
    assert n == 11
    
    soma = sum(dados)
    assert soma == 44.0, f"Soma esperada 44.0, obtida {soma}"
    
    media = soma / n
    assert media == 4.0, f"Média esperada 4.0, obtida {media}"
    
    mediana = statistics.median(dados)
    assert mediana == 4.0, f"Mediana esperada 4.0, obtida {mediana}"
    
    # Teste Hipótese A: exclusão do estudante 8 (tempo = 3.0h)
    dados_sem_8 = [4.0, 4.5, 3.25, 5.0, 3.25, 6.25, 4.25, 2.0, 5.0, 3.5]
    mediana_sem_8 = statistics.median(dados_sem_8)
    # Com 10 valores, mediana é a média entre 5º e 6º elementos ordenados:
    # Ordenados: [2.0, 3.25, 3.25, 3.5, 4.0, 4.25, 4.5, 5.0, 5.0, 6.25]
    # 5º é 4.0, 6º é 4.25 -> mediana = 4.125 > 4.0 (aumentaria, e não diminuiria)
    assert mediana_sem_8 == 4.125 > mediana
    
    # Teste Hipótese B: aumento de 1h em cada tempo
    dados_mais_1 = [x + 1 for x in dados]
    media_mais_1 = statistics.mean(dados_mais_1)
    assert media_mais_1 == 5.0 != media
    
    # Teste Hipótese C: aumento de 2h em cada tempo
    dados_mais_2 = [x + 2 for x in dados]
    mediana_mais_2 = statistics.median(dados_mais_2)
    assert mediana_mais_2 == 6.0 != mediana
    
    # Teste Hipótese D: inclusão de mais um estudante com 3h
    dados_com_novo = dados + [3.0]
    nova_media = statistics.mean(dados_com_novo)
    # nova_media = 47 / 12 = 3.91666... < 4.0
    assert nova_media < media
    assert Fraction(47, 12) < 4
    
    print(f"Média original: {media}h, Mediana original: {mediana}h")
    print(f"Hipótese A: mediana sem est. 8 = {mediana_sem_8}h (aumenta)")
    print(f"Hipótese B: nova média = {media_mais_1}h (muda)")
    print(f"Hipótese C: nova mediana = {mediana_mais_2}h (muda)")
    print(f"Hipótese D: nova média com 12º aluno (3h) = {float(nova_media):.3f}h < {media}h (diminui)")
    print("Alternativa correta confirmada: D")

if __name__ == "__main__":
    verificar_estatistica()
