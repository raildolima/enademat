# Regras de Conteúdo: Questões e Textos-Base

**Glos de Aplicação:** `content/**/questoes/**`, `content/**/textos-base/**`

## Modelo de Dados (Tipos)
Cada questão reside em um arquivo individual `content/provas/<provaId>/questoes/qNNN.json` (ou `dNN.json`).
Cada texto-base reside em `content/provas/<provaId>/textos-base/tb-XX-YY.json`.

Estrutura de blocos:
- `titulo`: texto formatado (ex.: "TEXTO I")
- `paragrafo`: texto rico
- `formula`: LaTeX em destaque (`displayMode: true`)
- `lista`: ordenada boolean, itens: string[]
- `afirmativas`: itens com rotulo ('I' | 'II' | 'III' | 'IV' | 'V') e texto
- `conectivo`: texto 'PORQUE' (asserção-razão)
- `tabela`: cabecalho?, linhas, legenda?
- `imagem`: src, alt (>= 15 chars, descritivo), legenda?, larguraMaxPx?
- `quadro`: blocos internos agrupados
- `fonte`: crédito alinhado à direita

## Padrão de Transcrição
1. Fidelidade literal ao texto da prova: pontuação, negritos e itálicos originais. Nunca resumir nem alterar o texto.
2. Fórmulas matemáticas em LaTeX compatível com KaTeX.
3. Separador decimal sempre com vírgula protegida por chaves: `$1{,}44$`.
4. Espaço de milhar dentro de fórmulas com barra fina: `$41\,000$`.
5. **Símbolo do real sempre com escape de barra:** `R\$`. Jamais usar `$` isolado para moeda.
6. Nunca transcrever cabeçalhos, rodapés, "QUESTÃO NN", números de página ou "Área livre".
7. Correções pontuais de erro tipográfico evidente da diagramação (ex.: ∈ em vez de ε) devem ser anotadas no campo `notaEditorial` e documentadas no relatório.
8. Texto ilegível: jamais inventar. Registrar em `work/relatorios/transcricao-<provaId>.md` e acionar revisão humana.

## Exemplo Padrão (q032)
```json
{
  "id": "2025-prova1-q032",
  "provaId": "2025-prova1",
  "tipo": "objetiva",
  "numero": 32,
  "rotulo": "Questão 32",
  "parte": "componente-especifico",
  "ordemCaderno": 33,
  "paginas": [20],
  "textoBaseId": "tb-31-32",
  "enunciado": [
    { "tipo": "paragrafo", "texto": "De acordo com os dados laboratoriais..." }
  ],
  "alternativas": [
    { "letra": "A", "blocos": [{ "tipo": "paragrafo", "texto": "$C(t) = (1{,}44 \\times 10^{7}) \\cdot e^{-0{,}1t}$" }] }
  ]
}
```
