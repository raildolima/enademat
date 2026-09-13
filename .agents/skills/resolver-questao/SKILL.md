---
name: resolver-questao
description: Escreve a resolução comentada de uma questão do ENADE (objetiva ou discursiva) seguindo o protocolo anti-erro e a estrutura oficial do projeto. Use na Fase 6, depois da etapa cega.
---
# Resolver questão

## Entradas
questaoId; work/cego/<provaId>/<arquivo>.json (resposta cega); gabarito.json; página PNG; docs/ESPECIFICACAO.md seção 0.12; exemplo content/provas/2025-prova1/resolucoes/q032.md.

## Passos (execute na ordem, sem pular)
1. Abra o JSON da questão e a página PNG. Confirme que entendeu todas as figuras e dados.
2. Leia a resposta cega em work/cego. Leia o gabarito oficial.
3. Se forem diferentes: releia a página, a transcrição e os arredondamentos. Refaça a questão. Se continuar diferente, a resolução chega ao gabarito oficial explicando a intenção da banca e inclui "## Observação"; defina revisaoHumana: true; registre em work/relatorios/divergencias.md.
4. Se houver QUALQUER conta: crie scripts/verificacao/<provaId>/qNNN.py (modelo: q032.py) e rode com .venv\Scripts\python. Use os números impressos.
5. Escreva content/provas/<provaId>/resolucoes/<arquivo>.md com frontmatter (questaoId, respostaIndependente = resposta cega, respostaFinal = gabarito, verificacao: pendente, revisaoHumana, checagemNumerica) e as seções EXATAS da estrutura (objetiva ou discursiva).
6. Em "## Análise das alternativas": uma linha para CADA letra, na ordem A, B, C, D (E em 2021). Em questões I/II/III, julgue cada afirmativa no passo a passo.
7. Rode: npm run content:validate -- --arquivo <resolução>. Corrija até zero erros.

## Proibido
Placeholders; "é fácil ver"; pular contas; citar lei, artigo ou autor sem certeza; alterar gabarito.json; editar outra questão.

## Concluído quando
O validador passa e a mensagem final traz: questaoId | resposta cega | gabarito | script numérico (caminho ou "não se aplica") | revisaoHumana.
