"""
Verificação formal da Questão 49 - ENADE 2025 Prova 5
Quadrado Mágico com incógnitas de 1º grau e soma total 90.
"""
import sympy as sp

def verificar_quadrado_magico_incognitas():
    x, y, z = sp.symbols('x y z', real=True)
    
    # Soma total das 3 linhas = 90 => constante mágica de cada linha S = 30
    S = 90 // 3
    assert S == 30
    
    # Equações de cada linha:
    eq_l1 = sp.Eq(2*y + 2 + (2*y + 4), S)
    eq_l2 = sp.Eq(7*x + 5*x + 6, S)
    eq_l3 = sp.Eq(z + 18 + 2*z, S)
    
    sol_y = sp.solve(eq_l1, y)[0]
    sol_x = sp.solve(eq_l2, x)[0]
    sol_z = sp.solve(eq_l3, z)[0]
    
    assert sol_x == 2
    assert sol_y == 6
    assert sol_z == 4
    
    # Matriz resultante:
    matriz = [
        [int(2*sol_y), 2, int(2*sol_y + 4)],
        [int(7*sol_x), int(5*sol_x), 6],
        [int(sol_z), 18, int(2*sol_z)]
    ]
    
    assert matriz == [
        [12, 2, 16],
        [14, 10, 6],
        [4, 18, 8]
    ]
    
    # Verificação de todas as linhas, colunas e diagonais
    for i in range(3):
        assert sum(matriz[i]) == 30, f"Linha {i} divergente"
        assert sum(matriz[j][i] for j in range(3)) == 30, f"Coluna {i} divergente"
        
    assert sum(matriz[i][i] for i in range(3)) == 30, "Diag principal divergente"
    assert sum(matriz[i][2 - i] for i in range(3)) == 30, "Diag secundária divergente"
    
    print(f"Soluções: x = {sol_x}, y = {sol_y}, z = {sol_z}")
    print("Linha 1:", matriz[0])
    print("Linha 2:", matriz[1])
    print("Linha 3:", matriz[2])
    print("Alternativa correta confirmada: A")

if __name__ == "__main__":
    verificar_quadrado_magico_incognitas()
