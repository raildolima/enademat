# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Produto

Webapp 100% estático (Vite + React 19 + TypeScript) com as 202 questões do ENADE Matemática Licenciatura — provas `2021-licenciatura`, `2025-prova1`, `2025-prova5` — e resoluções comentadas. Todo conteúdo e comunicação do projeto em **pt-BR**.

- Fonte da verdade: `docs/ESPECIFICACAO.md`. Plano de fases: `PLANO-ANTIGRAVITY-GEMINI-3.8-FLASH.md`. Andamento: `docs/PROGRESSO.md` (atualizar ao fim de cada lote). Pendências de revisão: `docs/REVISAO-HUMANA.md`.
- `AGENTS.md` e `.agents/rules/*.md` contêm as regras detalhadas (conteúdo, resoluções, figuras, app). Ler a regra correspondente antes de editar a área dela.
- `.agents/skills/` (recortar-figuras, transcrever-questao, resolver-questao, verificar-resolucao, conferir-ui) e `.agents/agents/` (transcritor, resolvedor-cego, resolvedor-matematica, resolvedor-formacao-geral, verificador, recortador-figuras) descrevem os fluxos de trabalho por fase; seguir o arquivo correspondente ao fazer esse tipo de tarefa.

## Comandos

```bash
npm run dev                  # content:build + vite
npm run build                # content:build + tsc -b + vite build
npm run preview              # serve dist/ (porta 4173)
npm test                     # vitest (tests/unit/**)
npx vitest run tests/unit/filtrar.test.ts        # um arquivo unitário
npm run test:e2e             # playwright (desktop-chromium + mobile-touch); faz build e sobe preview na porta 4290
npx playwright test tests/e2e/popup.spec.ts --project=desktop-chromium   # um spec
npm run lint                 # oxlint
npx tsc -b                   # app + vite.config + scripts/testes (tsconfig.scripts.json)
npm run content:build        # gera src/data/generated/*.json (gitignored)
npm run content:validate                      # tudo
npm run content:validate -- --prova 2025-prova1
npm run content:validate -- --arquivo content/provas/2025-prova1/resolucoes/q031.md
npm run content:validate -- --release         # exige verificacao: aprovada em todas as resoluções
npx tsx scripts/content/comparar-cego.ts --prova 2025-prova1   # respostas cegas x gabarito
.venv\Scripts\python scripts/pdf/<script>.py <provaId>          # pipeline PDF (PyMuPDF, Pillow, NumPy)
.venv\Scripts\python scripts/verificacao/<provaId>/qNNN.py      # checagem numérica (SymPy)
.venv\Scripts\python -m unittest discover -s tests/python     # testes dos scripts Python
.venv\Scripts\python scripts/pdf/extrair_gabaritos.py --conferencia-visual-p1   # PDF da Prova 1 não tem texto legível; sem a flag sai com 1. Nunca sobrescreve gabarito.json diferente
```

E2E: `playwright.config.ts` roda `npm run build` e serve na porta 4290 com `--strictPort` e sem `reuseExistingServer` — porta ocupada dá erro "is already used" em vez de testar outro build (outras cópias do projeto, como `Enade_simulador - AGY`, usam a 4173). `scripts/conferir_ui_screenshots.ts` ainda aponta para a 4173 e exige preview iniciado à mão. `tests/e2e/conferir-ui.spec.ts` (capturas em `work/conferencia/ui/`) só roda com `CONFERIR_UI=1`.

`content:validate` é obrigatório após qualquer mudança em `content/`. Resultado final só é "concluído" com a saída de validação/testes colada.

## Arquitetura

**Pipeline de conteúdo → app:**
1. PDFs originais na raiz (nunca editar/mover/renomear) → `scripts/pdf/` renderiza páginas, extrai gabaritos, recorta figuras (`recortar.py` guiado por `content/provas/<id>/figuras.manifest.json`, bbox em pontos PyMuPDF, dpi 220) → `public/figuras/*.webp`.
2. `content/provas/<provaId>/`: `prova.json`, `gabarito.json` (oficial, **imutável**), `questoes/qNNN.json` | `dNN.json` (discursivas), `textos-base/tb-XX-YY.json`, `resolucoes/qNNN.md` (Markdown + frontmatter). Um arquivo por questão/resolução.
3. `scripts/content/schema.ts` (Zod) define tudo: questões são listas de **blocos** tipados (`paragrafo`, `formula`, `lista`, `afirmativas`, `conectivo`, `tabela`, `imagem`, `quadro`, `fonte`, `titulo`); frontmatter das resoluções (`questaoId`, `respostaIndependente`, `respostaFinal`, `verificacao`, `revisaoHumana`, `checagemNumerica?`). `validate.ts` checa schema, LaTeX/texto rico, existência de imagens e alt ≥ 15 chars, e confronta com `gabaritos-referencia.ts`.
4. `scripts/content/build.ts` junta tudo em `src/data/generated/indice.json` + um JSON por prova (resoluções embutidas como string Markdown). Lista de provas está hardcoded em `build.ts` e `ProvaIdSchema`.
5. App: `src/data/carregar.ts` importa dinamicamente os JSON gerados (cache em memória); `src/data/tipos.ts` são os tipos compartilhados com os scripts (o `BlocoSchema` do zod é tipado por eles). `src/data/useQuestao.ts` carrega questão+prova+índice descartando respostas obsoletas; `src/data/url.ts` lê filtros e `?marcada=` da URL com validação — usar esses dois nas páginas em vez de ler `searchParams` à mão. Rotas em `src/app/router.tsx` via `createHashRouter`: `/` (banco com filtros, `features/banco`, carregado de início), `/questao/:id` (`features/questao`, inclui rascunho de discursiva) e `/questao/:id/resolucao` (`features/resolucao`, com `PopupQuestao` em `@floating-ui/react`) são rotas `lazy` em chunks próprios. `components/Blocos.tsx` renderiza blocos; `components/Markdown.tsx` usa react-markdown + remark-math + rehype-katex + remark-gfm.

**Restrições do app:** sem servidor/rewrites; sem `localStorage`/cookies (estado só em memória ou na URL, ex. `?marcada=`); zero `.katex-error`; WCAG 2.2 AA (testado com `@axe-core/playwright`); alternativas com `role="radiogroup"`/`radio`. `tests/e2e/smoke-todas.spec.ts` abre todas as questões.

## Convenções de conteúdo

- LaTeX compatível com KaTeX. Decimal `$1{,}44$`; milhar `$41\,000$`; real sempre `R\$`.
- Transcrição literal; sem cabeçalhos/rodapés/"Área livre". Correção tipográfica vai em `notaEditorial`.
- Resoluções objetivas: seções `## Ideia-chave`, `## Resolução passo a passo`, `## Análise das alternativas`, `## Conceitos envolvidos`, `## Dica de prova`, `## Observação` (opcional). Discursivas: `## O que a questão pede`, `## Resposta esperada`, `## Critérios de avaliação`, `## Exemplo de resposta`, `## Conceitos e referências`.
- Resolver sem olhar o gabarito (`respostaIndependente`), depois comparar. Divergência com o gabarito: nunca alterar `gabarito.json`; explicar em `## Observação`, `revisaoHumana: true` e registrar em `work/relatorios/divergencias.md`.
- Questões com cálculo exigem script `scripts/verificacao/<provaId>/qNNN.py`.
- Nunca placeholders ("...", "TODO", "idem", "resto igual") em conteúdo.

## Regras de operação

- Fazer só o que a fase/lote pede; não editar arquivos fora do lote; não adicionar funcionalidades fora da especificação.
- No máximo 5 imagens por passo; usar PNG de página, nunca o PDF inteiro.
- Nunca `git push`, criar remoto ou publicar sem autorização explícita.
- Parar e perguntar: gabarito divergente em ≥ 2 questões do lote; erro persistente após 2 tentativas; qualquer exclusão fora de `work/`; qualquer publicação.
- `work/`, `scratch/`, `src/data/generated/`, `dist/` são gitignored.
