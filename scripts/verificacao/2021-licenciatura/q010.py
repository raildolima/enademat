"""
Verificação dos dados da Questão 10 - ENADE 2021 Matemática Licenciatura
Censo da Educação Superior 2017 - Licenciaturas
"""

def verificar_q010():
    # Dados percentuais observados no infográfico:
    # Sexo: Feminino ~71%, Masculino ~29%
    # Categoria: Privada ~62%, Pública ~38%
    # Modalidade: Presencial ~53% (ou 53,3%), Distância ~47% (ou 46,7%)
    # Organização: Universidade ~52%, Faculdade ~32%, Centro Universitário ~14%, IF/Cefet ~2%
    
    # Análise das alternativas:
    # A) "A maior quantidade de alunos matriculados é do sexo feminino e está na rede pública de ensino."
    # Falsa: A maioria dos alunos está na rede privada (62% privada vs 38% pública).
    
    # B) "A rede pública possui a maior quantidade de alunos matriculados na modalidade de ensino a distância e a maior parte é do sexo masculino."
    # Falsa: O sexo masculino representa apenas 29% do total, e a rede pública é minoria no total.
    
    # C) "A organização universidade possui a menor quantidade de alunos matriculados e a menor parte é do sexo feminino."
    # Falsa: Universidade possui a MAIOR quantidade de alunos matriculados (52%), e as mulheres são ampla maioria (71%).
    
    # D) "A modalidade de ensino a distância tem a menor quantidade de alunos matriculados em relação à modalidade presencial."
    # Verdadeira: EaD tem ~47% das matrículas, enquanto o presencial tem ~53%. Logo, EaD é estritamente menor que presencial.
    
    # E) "A menor quantidade de alunos matriculados é do sexo masculino, da rede pública e na modalidade presencial."
    # Falsa: A modalidade presencial NÃO é a menor (tem 53%, maior que 47%).
    
    modalidade_presencial = 53.3
    modalidade_distancia = 46.7
    assert modalidade_distancia < modalidade_presencial
    print(f"Modalidade a distância ({modalidade_distancia}%) < presencial ({modalidade_presencial}%).")
    print("Alternativa D é rigorosamente correta.")

if __name__ == '__main__':
    verificar_q010()
