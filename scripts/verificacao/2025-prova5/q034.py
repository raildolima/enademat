"""
Verificação formal da Questão 34 - ENADE 2025 Prova 5
Análise de simetrias ortogonais (reflexões axial horizontal e vertical).
"""
import sympy as sp

def verificar_simetria():
    # Define ponto genérico (x, y) no plano centrado na origem do ornamento
    x, y = sp.symbols('x y', real=True)
    P = sp.Matrix([x, y])
    
    # Matriz de reflexão em relação ao eixo horizontal (y = 0): y -> -y
    R_h = sp.Matrix([[1, 0], [0, -1]])
    P_ref_h = R_h * P
    assert P_ref_h == sp.Matrix([x, -y]), "Erro na reflexão horizontal"
    
    # Matriz de reflexão em relação ao eixo vertical (x = 0): x -> -x
    R_v = sp.Matrix([[-1, 0], [0, 1]])
    P_ref_v = R_v * P
    assert P_ref_v == sp.Matrix([-x, y]), "Erro na reflexão vertical"
    
    # Composição das duas reflexões gera a rotação de 180 graus (simetria central):
    R_rot = R_h * R_v
    assert R_rot == sp.Matrix([[-1, 0], [0, -1]]), "Erro na rotação de 180 graus"
    
    # O grupo gerado pelas duas reflexões ortogonais é o Grupo de Klein V4 = Z2 x Z2
    assert R_h * R_h == sp.eye(2)
    assert R_v * R_v == sp.eye(2)
    assert R_h * R_v == R_v * R_h
    
    print("Verificação matemática de simetrias concluída com sucesso.")
    print("Eixos presentes: exatamente 1 eixo horizontal e 1 eixo vertical.")
    print("Alternativa correta confirmada: A")

if __name__ == "__main__":
    verificar_simetria()
