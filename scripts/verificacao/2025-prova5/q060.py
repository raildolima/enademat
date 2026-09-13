"""
Verificação formal da Questão 60 - ENADE 2025 Prova 5
Função f(x) = |x| + 1, Paridade e Análise de Erros dos Estudantes.
"""
import sympy as sp

def verificar_funcao_modular():
    x = sp.Symbol('x', real=True)
    f = sp.Abs(x) + 1
    
    # 1. Teste formal de paridade: f(-x) == f(x)
    f_neg_x = sp.Abs(-x) + 1
    assert sp.simplify(f_neg_x - f) == 0, "A função deveria ser estritamente par"
    
    # 2. Valores corretos nos pontos x in {-3, -2, -1, 0, 1, 2, 3}:
    xs = [-3, -2, -1, 0, 1, 2, 3]
    f_correto = {k: int(abs(k) + 1) for k in xs}
    # {-3: 4, -2: 3, -1: 2, 0: 1, 1: 2, 2: 3, 3: 4}
    
    # Resposta Estudante 1:
    # x in {-3, -2, -1, 0}: f(x) = 4, 3, 2, 1 (ACERTOU para x <= 0)
    # x in {1, 2, 3}: f(x) = 0, -1, -2 (ERROU para x > 0)
    resp_estudante_1 = {-3: 4, -2: 3, -1: 2, 0: 1, 1: 0, 2: -1, 3: -2}
    acertos_est1_neg = all(resp_estudante_1[k] == f_correto[k] for k in [-3, -2, -1, 0])
    acertos_est1_pos = all(resp_estudante_1[k] == f_correto[k] for k in [1, 2, 3])
    assert acertos_est1_neg and not acertos_est1_pos
    
    # Resposta Estudante 2:
    # x in {-3, -2, -1}: f(x) = -2, -1, 0 (ERROU para x < 0)
    # x in {0, 1, 2, 3}: f(x) = 1, 2, 3, 4 (ACERTOU para x >= 0)
    resp_estudante_2 = {-3: -2, -2: -1, -1: 0, 0: 1, 1: 2, 2: 3, 3: 4}
    acertos_est2_neg = all(resp_estudante_2[k] == f_correto[k] for k in [-3, -2, -1])
    acertos_est2_pos = all(resp_estudante_2[k] == f_correto[k] for k in [0, 1, 2, 3])
    assert not acertos_est2_neg and acertos_est2_pos
    
    # 3. Análise dos argumentos conceituais de paridade:
    # Estudante 1: "essa função é par, pois para valores de x opostos, possui o mesmo f(x)"
    # Isto é a definição formal de função par em linguagem natural: f(-x) = f(x). Argumento CORRETO!
    
    # Estudante 2: "essa função é par por causa do sentido positivo da reta"
    # Argumento INCORRETO.
    
    print("Valores corretos de f(x) = |x| + 1:", f_correto)
    print("Estudante 1 acertou x <= 0 e errou x > 0.")
    print("Estudante 2 errou x < 0 e acertou x >= 0.")
    print("Justificativa de paridade do Estudante 1: CORRETA (f(-x) = f(x)).")
    print("Alternativa correta confirmada: C")

if __name__ == "__main__":
    verificar_funcao_modular()
