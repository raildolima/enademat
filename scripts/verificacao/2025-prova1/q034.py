import sympy as sp

t = sp.symbols('t', real=True)
f = 500 * (1 + 0.0093 * t)

# Taxa de variação instantânea (derivada em relação a t)
taxa_variacao = sp.diff(f, t)

print(f"Função: f(t) = {f}")
print(f"Taxa de variação df/dt = {taxa_variacao}")

# Verifica se a derivada é independente de t (constante)
eh_constante = taxa_variacao.has(t) == False
valor_taxa = float(taxa_variacao)

print(f"É constante? {eh_constante}")
print(f"Valor numérico da taxa: {valor_taxa}")

alternativas = {
    "A": ("constante", 0.0093),
    "B": ("crescente", "0.0093*t"),
    "C": ("crescente", "500*0.0093*t"),
    "D": ("constante", 500 * 0.0093)
}

coincidentes = []
for letra, (tipo, val) in alternativas.items():
    if tipo == "constante" and abs(val - valor_taxa) < 1e-9:
        coincidentes.append(letra)

print("Alternativa coincidente:", coincidentes)
assert coincidentes == ["D"], f"Esperado ['D'], obtido {coincidentes}"
