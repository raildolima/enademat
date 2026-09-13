"""
Verificação Numérica e Algébrica de Q67 e Q68 — ENADE 2025 Prova 5
Fundamentos de Análise Real: Ínfimo, Supremo, Limitação e Teorema do Valor Intermediário (TVI).
"""
import sympy as sp

def testar_q067():
    # S = (3, 6]
    # Cotas inferiores: (-inf, 3]
    # Maior cota inferior (ínfimo): 3
    # Mínimo: não existe em S, pois 3 não pertence a S
    # Cotas superiores: [6, +inf)
    # Menor cota superior (supremo): 6
    # Máximo: 6 (pois 6 pertence a S)
    infimo = 3
    maximo = 6
    soma_aproximada = infimo + maximo
    assert soma_aproximada == 9, "Soma de ínfimo e máximo deve ser 9"
    print("Q67: Ínfimo = 3, Máximo = 6 => Soma = 9.")

def testar_q068():
    # Contraexemplo para a afirmativa C de Q68:
    # Função contínua f(x) ligando (0, 1) a (2, 3): f(x) = x + 1
    # Derivada f'(x) = 1 != 0 para todo x em [0, 2].
    # Logo, NÃO existe nenhuma reta horizontal tangente ao gráfico de f!
    x = sp.Symbol('x', real=True)
    f = x + 1
    df = sp.diff(f, x)
    solucoes_tangente_horizontal = sp.solve(df, x)
    assert len(solucoes_tangente_horizontal) == 0, "Reta estritamente crescente não admite tangente horizontal"
    print("Q68: f(x) = x + 1 é contínua e não possui reta tangente horizontal. Alternativa C refutada para o caso geral!")

if __name__ == "__main__":
    testar_q067()
    testar_q068()
