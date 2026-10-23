from sympy import Matrix, symbols, Rational

A = Matrix([[2, 1], [1, 1]])
det_A = A.det()
vertices = [Matrix([0, 0]), Matrix([1, 0]), Matrix([1, 1]), Matrix([0, 1])]
imagens = [A * v for v in vertices]
print("det(A) =", det_A)
print("vértices de Q:", [tuple(v) for v in vertices])
print("vértices de T(Q):", [tuple(v) for v in imagens])

# área pela fórmula de Gauss (shoelace) sobre T(Q), na ordem dos vértices
xs = [v[0] for v in imagens] + [imagens[0][0]]
ys = [v[1] for v in imagens] + [imagens[0][1]]
area_imagem = Rational(abs(sum(xs[i] * ys[i + 1] - xs[i + 1] * ys[i] for i in range(4))), 2)
print("área de T(Q) =", area_imagem)
print("área(Q) * |det A| =", 1 * abs(det_A))

# forma: lados consecutivos de T(Q) são ortogonais?
lado1 = imagens[1] - imagens[0]
lado2 = imagens[3] - imagens[0]
print("produto escalar dos lados adjacentes =", (lado1.T * lado2)[0], "(não nulo: não é retângulo)")
print("módulo de T(e1) =", A[:, 0].norm(), "(não é o critério de área)")
print("coincidem com a alternativa B (área 1, paralelogramo):", area_imagem == 1 and (lado1.T * lado2)[0] != 0)
