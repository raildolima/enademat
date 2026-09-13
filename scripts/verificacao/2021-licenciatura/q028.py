"""
Verificação geométrica e trigonométrica da Questão 28 - ENADE 2021 Matemática Licenciatura
Cubo ABCDEFGH de aresta a = 4. Triângulo PCH retângulo em H.
"""
import sympy as sp

def verificar_q028():
    # Aresta do cubo
    a = 4
    # CH é a aresta vertical do cubo, perpendicular ao plano da face superior que contém FH.
    CH = a # 4
    
    # Como CH é ortogonal a todas as retas da face superior que passam por H, CH é perpendicular a FH.
    # Logo, no triângulo PCH, o ângulo CHP é reto: CHP = 90°
    ang_CHP = 90
    ang_PCH = 30 # dado no enunciado
    
    # III. Ângulo CPH
    ang_CPH = 180 - (ang_CHP + ang_PCH)
    print(f"Ângulo CPH: {ang_CPH}°")
    assert ang_CPH == 60
    print("Afirmação III: Verdadeira (CPH = 60°).")
    
    # II. Hipotenusa CP
    # cos(30°) = CH / CP => CP = CH / cos(30°)
    cos30 = sp.sqrt(3) / 2
    CP = CH / cos30
    CP_simplificado = sp.simplify(CP)
    esperado_CP = sp.Rational(8, 3) * sp.sqrt(3)
    assert sp.simplify(CP_simplificado - esperado_CP) == 0
    print(f"Comprimento CP: {CP_simplificado} = (8*sqrt(3))/3")
    print("Afirmação II: Verdadeira (CP = 8*sqrt(3)/3).")
    
    # I. Cateto HP
    # tan(30°) = HP / CH => HP = CH * tan(30°)
    tan30 = sp.sqrt(3) / 3
    HP = CH * tan30
    HP_simplificado = sp.simplify(HP)
    print(f"Comprimento HP: {HP_simplificado} = (4*sqrt(3))/3")
    
    afirmacao_I = sp.Rational(4, 3) * sp.sqrt(6)
    assert sp.simplify(HP_simplificado - afirmacao_I) != 0
    print("Afirmação I: Falsa (o valor correto é (4*sqrt(3))/3, diferente de (4*sqrt(6))/3).")
    
    print("\nConclusão: Afirmações corretas II e III, apenas -> Alternativa D.")

if __name__ == '__main__':
    verificar_q028()
