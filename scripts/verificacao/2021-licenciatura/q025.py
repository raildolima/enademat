"""
Verificação dos dados da Questão 25 - ENADE 2021 Matemática Licenciatura
Ranking de qualidade dos sistemas previdenciários (escala 1 a 7, sendo 1 a melhor nota).
"""

def verificar_q025():
    # Notas dos países constantes no gráfico q025-f1:
    # 1º: Suécia = 2.91
    # 2º: Noruega = 2.92
    # 3º: Dinamarca = 2.98
    # 4º: Austrália = 3.01
    # 5º: EUA = 3.04
    # Brasil = 3.98
    
    nota_brasil = 3.98
    melhores_5 = {
        'Suécia': 2.91,
        'Noruega': 2.92,
        'Dinamarca': 2.98,
        'Austrália': 3.01,
        'EUA': 3.04
    }
    
    print("Notas dos 5 melhores países (1 é a melhor nota possível):")
    diferencas = {}
    for pais, nota in melhores_5.items():
        diff = round(nota_brasil - nota, 2)
        diferencas[pais] = diff
        print(f"{pais}: nota {nota} -> distância para o Brasil: {diff}")
        
    menor_distancia = min(diferencas.values())
    print(f"\nMenor distância entre o índice dos 5 melhores e o Brasil: {menor_distancia} (EUA)")
    
    assert menor_distancia == 0.94
    print("Alternativa E confirmada: O índice dos 5 melhores está, no mínimo, a 0,94 pontos do Brasil.")

if __name__ == '__main__':
    verificar_q025()
