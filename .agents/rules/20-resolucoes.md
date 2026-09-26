# Regras para Resoluções Comentadas

**Glos de Aplicação:** `content/**/resolucoes/**`, `scripts/verificacao/**`

## Protocolo Anti-Erro
1. Resolver sem consultar o gabarito oficial; registrar `respostaIndependente`.
2. Comparar com `gabarito.json`. O gabarito oficial NUNCA é modificado. Se houver divergência, explicar no passo a passo o raciocínio da banca, adicionar `## Observação` com a divergência fundamentada e marcar `revisaoHumana: true`.
3. Questões com cálculo: script em `scripts/verificacao/<provaId>/qNNN.py` (SymPy/fractions) obrigatório.
4. Verificação independente por outro agente em contexto limpo.
5. Citações pedagógicas ou de leis apenas com precisão conferida.

## Estrutura — Questões Objetivas
```md
---
questaoId: <id>
respostaIndependente: <letra>
respostaFinal: <letra-oficial>
verificacao: pendente | aprovada | reprovada
revisaoHumana: false | true
checagemNumerica: scripts/verificacao/<provaId>/qNNN.py
---

## Ideia-chave
(1–3 frases com o objetivo da questão e o cerne da solução)

## Resolução passo a passo
**Passo 1 — ...**
...
**Conclusão:** alternativa **X**.

## Análise das alternativas
- **A — incorreta.** motivo específico do erro
- **B — incorreta.** ...
- **X — correta.** justificativa sucinta

## Conceitos envolvidos
- **Conceito:** definição ou teorema aplicado

## Dica de prova
(opcional, 1–2 frases)

## Observação
(apenas se houver ambiguidade, erro de enunciado ou ressalva técnica)
```

## Estrutura — Questões Discursivas
```md
---
questaoId: <id>
respostaIndependente: <resumo, em texto livre e não vazio, da resposta elaborada sem consultar o padrão>
respostaFinal: <resumo, em texto livre e não vazio, do padrão de resposta adotado>
verificacao: pendente | aprovada | reprovada
revisaoHumana: false | true
---

## O que a questão pede
## Resposta esperada
## Critérios de avaliação
## Exemplo de resposta
## Conceitos e referências
```
- Extensão esperada: 2021 <= 15 linhas (~150–180 palavras); 2025 <= 30 linhas (~300–350 palavras).
