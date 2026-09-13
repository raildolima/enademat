---
name: recortar-figuras
description: Recorta figuras de um lote de páginas das provas do ENADE e mantém figuras.manifest.json. Use na Fase 3.
---
# Recortar figuras

## Passos
1. Leia a seção 0.10 de `docs/ESPECIFICACAO.md`.
2. Para cada página do lote, abra `work/candidatos/<provaId>/pNNN.png` e `work/paginas-grade/<provaId>/pNNN.png` (máximo de 5 imagens por passo).
3. Decida: recortar x transcrever. Em alternativas-imagem, identifique a letra impressa (em grade 2x2: A e C em cima; B e D embaixo).
4. Grave apenas as entradas das páginas do lote no manifesto `content/provas/<provaId>/figuras.manifest.json` (bbox em pt; nomes `qNNN-f1.webp`, `qNNN-alt-a.webp`, `tb-XX-YY-f1.webp`).
5. Execute `.venv\Scripts\python scripts/pdf/recortar.py <provaId> --paginas <lista>`.
6. Abra cada WebP gerado e aprove somente se nenhum rótulo, eixo ou legenda interna estiver cortado e nenhum texto externo (cabeçalho, rodapé, "Área livre") tiver sido incluído.
7. No máximo 3 iterações por figura; caso persista dúvida, marque `status: "revisao-humana"`.

## Concluído quando
Todas as figuras do lote estiverem com status `aprovado` ou `revisao-humana`, gerando uma tabela resumo: arquivo | página | uso | status | observação.
