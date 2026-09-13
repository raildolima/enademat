"""Verificação algébrica e numérica da Questão 59 - ENADE 2025 Prova 1.
Sistema de equações:
  x + y = x*y = x / y,  com y != 0
"""
from sympy import symbols, Eq, solve, Rational

def test_q059():
    x, y = symbols('x y', real=True)
    
    # Equação 1: x + y = x*y
    # Equação 2: x*y = x / y  <=> x*y^2 = x (com y != 0)
    
    eq1 = Eq(x + y, x * y)
    eq2 = Eq(x * y, x / y)
    
    # Resolver o sistema sob a restrição y != 0
    solucoes = solve([eq1, eq2], (x, y))
    
    # Filtrar apenas soluções com y != 0
    solucoes_validas = [(sx, sy) for sx, sy in solucoes if sy != 0]
    
    print(f"Soluções válidas encontradas: {solucoes_validas}")
    assert len(solucoes_validas) == 1, f"Esperada exatamente 1 solução, obtidas: {len(solucoes_validas)}"
    
    sx, sy = solucoes_validas[0]
    assert sx == Rational(1, 2), f"x esperado 1/2, obtido: {sx}"
    assert sy == -1, f"y esperado -1, obtido: {sy}"
    
    # Propriedades da solução (Alternativa D)
    # y é um número inteiro negativo (-1)
    # x é um número racional positivo e não inteiro (1/2)
    assert sy < 0 and sy.is_integer
    assert sx > 0 and not sx.is_integer and sx.is_rational
    
    # Verificar igualdades
    v1 = sx + sy
    v2 = sx * sy
    v3 = sx / sy
    assert v1 == v2 == v3 == Rational(-1, 2)
    
    print("Verificação de Q59 concluída com 100% de sucesso!")

if __name__ == "__main__":
    test_q059()
