# Simulador ENADE Matemática — instruções para agentes

## Produto
Webapp estático (Vite + React + TypeScript) com as 202 questões do ENADE Matemática Licenciatura (2021, 2025-prova1, 2025-prova5) e resoluções comentadas. Fonte da verdade: docs/ESPECIFICACAO.md. Plano: PLANO-ANTIGRAVITY-GEMINI-3.8-FLASH.md.

## Comandos
- npm run dev | build | preview | test | test:e2e
- npm run content:validate [-- --prova <id> | --arquivo <caminho> | --release]  (OBRIGATÓRIO após mudar content/)
- npm run content:build
- .venv\Scripts\python scripts/pdf/<script>.py <provaId>

## Regras invioláveis
1. O gabarito oficial (content/provas/*/gabarito.json) NUNCA muda. Divergência: seção Observação + revisaoHumana: true + work/relatorios/divergencias.md.
2. Um arquivo por questão e por resolução. NUNCA editar arquivos fora do lote atual.
3. Figuras SOMENTE via figuras.manifest.json + scripts/pdf/recortar.py. PDFs originais NUNCA são editados, movidos ou renomeados.
4. Conteúdo em pt-BR. LaTeX compatível com KaTeX. Decimal {,}. Real = R\$.
5. NUNCA git push, criar repositório remoto ou publicar sem autorização explícita do usuário.
6. No máximo 5 imagens por passo. Usar PNG de página, não o PDF inteiro.
7. "Concluído" SOMENTE com a saída dos comandos de validação/teste colada no Walkthrough.
8. Fazer apenas o que a fase pede. NUNCA adicionar funcionalidades fora da especificação.
9. NUNCA usar placeholders ("...", "TODO", "idem", "resto igual") em conteúdo.

## Como trabalhar
- Modo Planning. Task List sempre atualizada. Atualizar docs/PROGRESSO.md ao fim de cada lote.
- Skills: recortar-figuras (Fase 3), transcrever-questao (Fase 4), resolver-questao e verificar-resolucao (Fase 6), conferir-ui (Fases 5 e 7).
- Subagentes: recortador-figuras, transcritor, resolvedor-cego, resolvedor-matematica, resolvedor-formacao-geral, verificador.
- Parar e perguntar ao usuário: gabarito divergente em 2 ou mais questões do lote; erro que persiste após 2 tentativas; qualquer exclusão fora de work/; qualquer publicação.

## Mapa
content/ dados · public/figuras/ recortes · scripts/pdf/ Python · scripts/content/ TS · src/ app · tests/e2e/ · work/ temporário · docs/
