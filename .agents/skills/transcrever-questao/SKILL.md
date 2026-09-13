---
name: transcrever-questao
description: Transcreve fielmente questões e textos-base das provas do ENADE para o formato JSON do projeto. Use na Fase 4.
---
# Transcrever questão

## Passos
1. Leia a seção 0.11 de `docs/ESPECIFICACAO.md` e o arquivo modelo `content/provas/2025-prova1/questoes/q032.json`.
2. Abra a página PNG correspondente e o texto bruto extraído em `work/inventario/<provaId>/pNNN.txt` (a imagem PNG é a fonte primária de verdade).
3. Escreva o JSON de cada questão e texto-base individualmente.
4. Checklist obrigatório:
   - Alternativas na ordem alfabética e contagem correta (4 para 2025, 5 para 2021);
   - Alternativas-imagem associadas pela letra impressa;
   - Itens "I, II, III" e "PORQUE" como blocos próprios (`afirmativas`, `conectivo`);
   - Tabelas transcritas como blocos estruturados;
   - Crédito/referência como bloco `fonte`;
   - Todos os valores monetários com `R\$`;
   - Descrições de imagem (`alt`) completas com dados necessários para resolução.
5. Execute `npm run content:validate -- --arquivo <caminho>`.
6. Compare palavra por palavra com o PNG.

## Concluído quando
Validador passar sem erros e for emitida a lista resumo: questão | arquivo | figuras | notas editoriais.
