"""Verificação da Questão 73 - ENADE 2025 Prova 1.
Teorema de Pitágoras e a regra do pedreiro (terna pitagórica 3-4-5 escalonada).
Catetos dados: 120 m e 160 m.
Regra do pedreiro: 60 cm, 80 cm, 100 cm.
"""
import math

def test_q073():
    # Catetos dados pela professora
    b = 120
    c = 160
    
    # Teorema de Pitágoras
    a = math.sqrt(b**2 + c**2)
    print(f"Catetos {b} m e {c} m -> Hipotenusa: {a} m")
    assert a == 200.0, f"Hipotenusa esperada 200, obtida {a}"
    
    # Regra do pedreiro
    b_pedreiro = 60
    c_pedreiro = 80
    a_pedreiro = math.sqrt(b_pedreiro**2 + c_pedreiro**2)
    print(f"Regra do pedreiro: {b_pedreiro}, {c_pedreiro} -> {a_pedreiro}")
    assert a_pedreiro == 100.0
    
    # Proporcionalidade: fator 2 (120/60 = 2, 160/80 = 2 -> 100 * 2 = 200)
    assert b / b_pedreiro == 2.0
    assert c / c_pedreiro == 2.0
    assert a_pedreiro * 2 == a
    
    print("Verificação do Teorema de Pitágoras e Etnomatemática concluída com sucesso!")

if __name__ == "__main__":
    test_q073()
