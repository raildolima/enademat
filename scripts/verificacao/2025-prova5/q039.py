"""
Verificação formal da Questão 39 - ENADE 2025 Prova 5
Operações entre conjuntos: A \\ (A inter B) = A \\ B.
"""
import sympy as sp

def verificar_operacoes_conjuntos():
    # 1. Teste com conjuntos em Python
    A = {1, 2, 3, 4, 5}
    B = {3, 4, 5, 6, 7}
    
    # Peças iguais nos dois conjuntos (interseção):
    inter = A.intersection(B)
    assert inter == {3, 4, 5}
    
    # Peças exclusivas de A, removendo as repetidas:
    exclusivas_A = A - inter
    assert exclusivas_A == {1, 2}
    
    # Definição formal de diferença A - B:
    diff_AB = A.difference(B)
    assert diff_AB == {1, 2}
    assert exclusivas_A == diff_AB
    
    # 2. Teste simbólico com SymPy FiniteSet
    s_A = sp.FiniteSet(1, 2, 3, 4)
    s_B = sp.FiniteSet(3, 4, 5, 6)
    
    s_inter = s_A.intersect(s_B)
    s_res = s_A - s_inter
    s_diff = s_A - s_B
    assert s_res == s_diff == sp.FiniteSet(1, 2)
    
    # 3. Equivalência em lógica proposicional:
    # x in A \\ (A inter B) <=> (x in A) e nao(x in A e x in B)
    p, q = sp.symbols('p q')  # p = (x in A), q = (x in B)
    # Procedimento dos estudantes: pertence a A e não pertence a (A inter B)
    expr_estudantes = p & ~(p & q)
    # Definição de A - B: pertence a A e não pertence a B
    expr_diferenca = p & ~q
    assert sp.simplify_logic(expr_estudantes) == sp.simplify_logic(expr_diferenca)
    
    print("Verificação algébrica e lógica concluída com sucesso:")
    print("A \\ (A inter B) <=> A \\ B (Diferença entre conjuntos A - B).")
    print("Alternativa confirmada: B")

if __name__ == "__main__":
    verificar_operacoes_conjuntos()
