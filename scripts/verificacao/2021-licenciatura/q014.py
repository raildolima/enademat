"""
Verificação estatística da Questão 14 - ENADE 2021 Matemática Licenciatura
"""
import statistics

def verificar_q014():
    precos = {
        'A': 150,
        'B': 250,
        'C': 300,
        'D': 400
    }
    
    vendas = ['A', 'D', 'D', 'D', 'B', 'D', 'B', 'D', 'B', 'B', 'A']
    assert len(vendas) == 11
    
    valores = [precos[m] for m in vendas]
    valores_ordenados = sorted(valores)
    
    print("Valores ordenados:", valores_ordenados)
    
    # 1. Média
    media = sum(valores) / len(valores)
    assert media == 300
    assert media == precos['C']
    print(f"Média: R$ {media:.2f} (igual ao preço da bicicleta C: R$ {precos['C']:.2f}) -> I é VERDADEIRA")
    
    # 2. Mediana
    mediana = statistics.median(valores)
    assert mediana == 250
    print(f"Mediana: R$ {mediana:.2f}")
    
    # 3. Moda
    moda = statistics.mode(valores)
    assert moda == 400
    print(f"Moda: R$ {moda:.2f}")
    
    # Afirmação II: Mediana e moda são iguais
    assert mediana != moda
    print("Mediana != Moda -> II é FALSA")
    
    # Afirmação III: Mediana é maior que a média
    assert not (mediana > media)
    print("Mediana (250) < Média (300) -> III é FALSA")
    
    print("\nApenas a afirmação I é correta -> Alternativa A.")

if __name__ == '__main__':
    verificar_q014()
