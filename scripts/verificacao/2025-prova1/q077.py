"""Verificação da Questão 77 - ENADE 2025 Prova 1.
Aritmética modular (mod 7) aplicada aos dias da semana.
"""

def test_q077():
    dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    
    # Exemplo do enunciado: hoje é quinta-feira (x = 4), daqui a 365 dias (k = 365)
    x = 4  # quinta-feira
    k = 365
    
    dia_futuro_mod = (x + k) % 7
    print(f"Hoje é {dias[x]} ({x}), daqui a {k} dias será {dias[dia_futuro_mod]} ({dia_futuro_mod})")
    
    # 365 = 52 * 7 + 1 -> k ≡ 1 (mod 7)
    # x + k = 4 + 365 = 369 = 52 * 7 + 5 -> dia 5 (Sexta-feira)
    assert dia_futuro_mod == 5
    assert (x + k) % 7 == 5
    
    # Conferir se a regra geral é sempre (x + k) % 7
    for d in range(7):
        for dias_a_frente in [1, 7, 10, 14, 100, 365]:
            assert (d + dias_a_frente) % 7 == (d + (dias_a_frente % 7)) % 7
            
    print("Verificação da aritmética modular dos dias da semana concluída com sucesso!")

if __name__ == "__main__":
    test_q077()
