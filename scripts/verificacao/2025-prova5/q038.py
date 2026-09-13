"""
Verificação formal da Questão 38 - ENADE 2025 Prova 5
Dízima periódica e regra de arredondamento em calculadora.
"""
from decimal import Decimal, getcontext, ROUND_HALF_UP

def verificar_dizima_e_arredondamento():
    # Divisão exata em fração: 73 / 99
    # Em fração decimal periódica:
    # 73 / 99 = 0.73737373737373...
    
    # Precisão de 20 casas decimais:
    getcontext().prec = 20
    d = Decimal(73) / Decimal(99)
    d_str = str(d)
    assert d_str.startswith("0.7373737373737373"), "Erro na expansão decimal periódica"
    
    # Simulação do visor de calculadora com 14 casas decimais:
    # Dígitos: 0. 73 73 73 73 73 73 73 (14 dígitos após a vírgula: 7 e 3)
    # O 14º dígito é 3, o 15º dígito é 7.
    # Como 7 >= 5, a regra padrão de arredondamento (ROUND_HALF_UP) incrementa o 3 para 4:
    getcontext().prec = 14
    # Arredondando para 14 casas decimais:
    d_14 = (Decimal(73) / Decimal(99)).quantize(Decimal('1e-14'), rounding=ROUND_HALF_UP)
    assert str(d_14) == "0.73737373737374", f"Esperado 0.73737373737374, obtido {d_14}"
    
    print(f"Expansão infinita periódica: {d_str[:22]}...")
    print(f"Resultado calculadora (14 casas arredondado): {d_14}")
    print("Conclusão: Resposta 1 é dízima periódica, resposta 2 é aproximação arredondada.")
    print("Alternativa confirmada: C")

if __name__ == "__main__":
    verificar_dizima_e_arredondamento()
