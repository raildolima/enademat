import sympy as sp

r, n = sp.symbols("r n", positive=True)
# Geometria: ângulo central 2π/n; metade = π/n; no triângulo raio–apótema–metade do lado,
# o cateto oposto a π/n é l/2 (hipotenusa r): l = 2 r sen(π/n); apótema a = r cos(π/n); 2p = n·l
l_sen = 2 * r * sp.sin(sp.pi / n)
two_p_sen = n * l_sen
l_cos = 2 * r * sp.cos(sp.pi / n)
two_p_cos = n * l_cos

# Teste numérico: hexágono regular (n = 6, r = 1) tem lado igual ao raio
print("n=6, r=1 -> l =", sp.nsimplify(sp.simplify(l_sen.subs({r: 1, n: 6}))), "(esperado 1)")
print("n=6, r=1 -> 2p =", sp.simplify(two_p_sen.subs({r: 1, n: 6})), "(esperado 6)")
# Verificação numérica do lado por distância entre vértices consecutivos
import math
for nn, rr in [(3, 2.0), (4, 1.5), (12, 3.0)]:
    v1 = (rr, 0.0)
    v2 = (rr * math.cos(2 * math.pi / nn), rr * math.sin(2 * math.pi / nn))
    lado = math.dist(v1, v2)
    print(f"n={nn}, r={rr}: lado geométrico={lado:.6f}, 2r sen(pi/n)={float(l_sen.subs({r: rr, n: nn})):.6f}")
# Alternativas: cos (A, D) falham para n = 6 e r = 1 pois dão 2 cos(π/6) = √3 ≠ 1
print("alternativa A (l cos) em n=6:", sp.simplify(l_cos.subs({r: 1, n: 6})))
print("alternativa B (l sen) coincide com a geometria:", sp.simplify(l_sen - 2 * r * sp.sin(sp.pi / n)) == 0)
