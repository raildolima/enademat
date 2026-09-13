---
name: verificar-resolucao
description: Audita de forma adversarial uma resolução do ENADE já escrita: refaz a questão, reexecuta contas, confere análise de todas as alternativas, citações e formato, e grava o veredito. Use na Fase 6 após cada lote.
---
# Verificar resolução

## Passos
1. Leia a questão (JSON + página PNG) e resolva sozinho ANTES de abrir a resolução. Anote sua letra.
2. Abra a resolução. Rode o script de checagemNumerica (se existir) e recalcule tudo o que ele não cobre.
3. Checklist (qualquer "não" = reprovada):
   - [ ] respostaFinal = gabarito oficial
   - [ ] cada passo tem justificativa e está correto
   - [ ] todas as alternativas analisadas com o erro específico
   - [ ] afirmativas I/II/III (ou asserção-razão) julgadas uma a uma
   - [ ] citações conferíveis e corretas (na dúvida, reprovar)
   - [ ] estrutura, extensão e tom conforme seção 0.12
   - [ ] LaTeX correto e sem "R$" sem barra
   - [ ] alt das figuras usadas descreve os dados corretamente (compare com o PNG)
4. Edite SOMENTE o campo verificacao (aprovada | reprovada).
5. Acrescente em work/relatorios/verificacao-<provaId>.md: questaoId | veredito | problemas (trecho → correção sugerida).

## Concluído quando
Todas as resoluções do lote têm veredito e o relatório foi atualizado.
