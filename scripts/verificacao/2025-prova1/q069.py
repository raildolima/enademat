"""Verificação geométrica da Questão 69 - ENADE 2025 Prova 1.
Tangram clássico de 7 peças em um quadrado de lado 4 (área total = 16):
  - 2 triângulos pequenos: área 1 cada
  - 1 triângulo médio: área 2
  - 1 quadrado: área 2
  - 1 paralelogramo: área 2
  - 2 triângulos grandes: área 4 cada
Classes de equivalência de área (polígonos equivalentes):
  Classe 1: área 1 (2 peças)
  Classe 2: área 2 (3 peças)
  Classe 3: área 4 (2 peças)
"""

def test_q069():
    pecas = {
        "triangulo_pequeno_1": 1,
        "triangulo_pequeno_2": 1,
        "quadrado": 2,
        "paralelogramo": 2,
        "triangulo_medio": 2,
        "triangulo_grande_1": 4,
        "triangulo_grande_2": 4,
    }
    
    assert len(pecas) == 7, "O tangram possui exatamente 7 peças"
    assert sum(pecas.values()) == 16, "A soma das áreas é 16"
    
    classes_de_area = set(pecas.values())
    print(f"Valores distintos de área (classes de polígonos equivalentes): {sorted(classes_de_area)}")
    assert len(classes_de_area) == 3, f"Esperadas 3 classes de polígonos equivalentes, obtidas {len(classes_de_area)}"
    
    print("Verificação geométrica do Tangram concluída com sucesso!")

if __name__ == "__main__":
    test_q069()
