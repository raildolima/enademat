"""
Verificação da Teoria dos Números da Questão 15 - ENADE 2021 Matemática Licenciatura
Divisão euclidiana, congruências, MDC e MMC.
"""
import math

def verificar_q015():
    # I. O resto da divisão de 7 * 18 - 2 por 7 é 5
    val_1 = 7 * 18 - 2 # 126 - 2 = 124
    # 124 = 7 * 17 + 5, resto euclidiano = 5
    q_1, r_1 = divmod(val_1, 7)
    assert r_1 == 5
    assert q_1 == 17
    print(f"I: 7*18 - 2 = {val_1} = 7*{q_1} + {r_1} -> resto é 5. (VERDADEIRA)")
    
    # II. Se m = 7 * 22 + 5 e n = 7 * 38 + 6, o resto da divisão de m + n por 7 é 3
    m = 7 * 22 + 5
    n = 7 * 38 + 6
    soma = m + n
    q_soma, r_soma = divmod(soma, 7)
    # 5 + 6 = 11 = 7 * 1 + 4 => resto é 4, NÃO 3!
    assert r_soma == 4
    assert r_soma != 3
    print(f"II: m + n = {soma} = 7*{q_soma} + {r_soma} -> resto é 4 != 3. (FALSA)")
    
    # III. O mmc(m, n) é um divisor do mdc(m, n)
    # Falso em geral! O mdc divide o mmc, e não o contrário.
    # Exemplo: m = 4, n = 6 => mdc = 2, mmc = 12. 12 não divide 2 (2 é divisor de 12).
    mdc_ex = math.gcd(4, 6) # 2
    mmc_ex = (4 * 6) // mdc_ex # 12
    assert mmc_ex % mdc_ex == 0 # mdc divide mmc
    assert mdc_ex % mmc_ex != 0 # mmc NÃO divide mdc
    print("III: mmc(m, n) é múltiplo do mdc(m, n), não divisor. (FALSA)")
    
    # IV. mdc(m, n) * mmc(m, n) = m * n (para inteiros positivos)
    # Testando para vários pares:
    for a, b in [(4, 6), (15, 25), (7, 13), (m, n)]:
        g = math.gcd(a, b)
        l = (a * b) // g
        assert g * l == a * b
    print("IV: mdc(m, n) * mmc(m, n) = m * n é propriedade fundamental da aritmética. (VERDADEIRA)")
    
    print("\nConclusão: São corretas apenas as afirmações I e IV -> Alternativa B.")

if __name__ == '__main__':
    verificar_q015()
