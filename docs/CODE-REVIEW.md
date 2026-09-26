# Relatório de Code Review — Simulador ENADE

- **Data:** 2026-09-26
- **Base:** commit `4ddefcf`, com alterações não commitadas no working tree (resoluções em `content/`, `src/components/Markdown.tsx`, `tests/e2e/smoke-todas.spec.ts`, `README.md`), incluídas na revisão.
- **Revisor:** agente `revisor-codigo` (`.claude/agents/revisor-codigo.md`), somente leitura.
- **Escopo:** `src/`, `scripts/content/`, `scripts/pdf/`, `scripts/hooks/`, `.agents/scripts/hooks/`, `tests/`, configs. Conteúdo (202 questões/resoluções) verificado só pelos validadores automáticos.
- **Principais conferidos manualmente após a revisão:** CR-01, CR-08, CR-14, CR-15 e CR-25 (trechos relidos no código).

> **Incidente durante a revisão (CR-25):** o `npm test` executado pelo revisor apagou `work/cego/2025-prova1/q032.json`. O arquivo foi restaurado a partir de `work/relatorios/cego-2025-prova1.md` (linha `2025-prova1-q032 | D | D | Sim | "Aplicação da teoria de funções afins por partes e cálculo do ponto de equilíbrio."`), no formato dos demais arquivos cegos (`questaoId`, `respostaCega`, `raciocinioCurto`). O raciocínio registrado não parece tratar do problema do chumbo da q032; vale conferir se o arquivo já estava incorreto antes. O agente foi ajustado para não rodar `npm test` completo enquanto CR-25 não for corrigido.

## Status das correções

| Achado | Status | Onde |
|---|---|---|
| CR-25 | Corrigido em 2026-09-26 | `tests/unit/fase2-tdd.test.ts` (teste 9 usa diretório temporário via `opts.raiz`) |
| CR-14 | Corrigido em 2026-09-26 | `scripts/content/validate.ts`: arquivo cego resolvido como `<nome>.json`; discursivas não comparadas (texto livre) |
| CR-15 | Corrigido em 2026-09-26 | `--release` exige `verificacao: aprovada` |
| CR-16 | Corrigido em 2026-09-26 | Contagens, gabarito completo e sem extras, `textoBaseId`, manifesto (`pendente`, órfã, imagem sem registro), resolução obrigatória, coerência id/numero/arquivo e `questaoId` |
| CR-17 | Corrigido em 2026-09-26 | `--prova` inexistente e `--arquivo` fora de `content/provas/<provaId>/` falham |
| CR-01 | Corrigido em 2026-09-26 | `src/app/Layout.tsx`: skip-link com `preventDefault` + foco no `<main tabIndex={-1}>` |
| CR-02 | Corrigido em 2026-09-26 | `PaginaQuestao` restaura `?marcada=` (só letra existente); Anterior/Próxima e banco não propagam `marcada` (também na resolução) |
| CR-07 | Corrigido em 2026-09-26 | `ConteudoQuestao`: setas movem foco e marcam (com volta ao início/fim); roving tabindex |
| CR-08 | Corrigido em 2026-09-26 | `Blocos`: conectivo sem `aria-hidden` |
| CR-09 | Corrigido em 2026-09-26 | `PopupQuestao`: `FloatingFocusManager` não modal (Tab entra no pop-up); Fechar usa o mesmo motivo do Esc, então o foco devolvido ao gatilho não reabre o pop-up |
| CR-03 | Corrigido em 2026-09-26 | `PaginaBanco`: termo gravado na URL como digitado; o trim fica só na filtragem (`filtrarQuestoes`) |
| CR-27 | Corrigido em 2026-09-26 | `smoke-todas.spec.ts`: espera o `h1` da tela nova e confere `naturalWidth > 0` de todas as imagens nas 202 questões (teste de mutação removendo uma figura do `dist/` fez a varredura falhar) |

| CR-10 | Corrigido em 2026-09-26 | `build.ts`: `extrairPrevia` mantém `$…$` e corta em espaço fora de fórmula/negrito (`R\$` tratado como moeda); 13 prévias com 24 fórmulas compilam no KaTeX |
| CR-11 | Corrigido em 2026-09-26 | `build.ts` anota `largura`/`altura` (via `image-size`) em todo bloco `imagem`; `Blocos` repassa como `width`/`height` |
| CR-26 | Corrigido em 2026-09-26 | `comparar-cego.ts` aceita `raiz`; o teste usa diretório temporário e não lê nem grava `work/` (md5 de `work/` idêntico após `npm test`) |
| CR-31 | Corrigido em 2026-09-26 | Rotas de questão e resolução com `lazy` + `HydrateFallback`; chunk principal 1.091 kB → 587 kB (gzip 333 → 181 kB). Restante é React + router + KaTeX, que o banco usa nas prévias |
| CR-18 | Corrigido em 2026-09-26 | `extrair_gabaritos.py`: sem preenchimento pela referência (a camada de texto do PDF da Prova 1 é só marca d'água: 0/80 lidas); não lidas exigem `--conferencia-visual-p1`; divergência ou não lida → exit 1; nunca sobrescreve `gabarito.json` diferente (sem gravação parcial). Testes em `tests/python/` |
| CR-19 | Corrigido em 2026-09-26 | `scripts/hooks/*.mjs` é a fonte única (`.agents/scripts/hooks/*.mjs` só importa e executa); regex aceita `\`, `\\` (JSON) e pastas com espaço; bloqueio da etapa cega olha `work/` e `../work/` |
| CR-04 | Corrigido em 2026-09-26 | `src/data/url.ts` `lerLetraMarcada`: só letras da questão (questão e resolução) |
| CR-05 | Corrigido em 2026-09-26 | `src/data/useQuestao.ts`: carregamento compartilhado que descarta resposta de questão anterior |
| CR-06 | Corrigido em 2026-09-26 | `lerFiltrosDaUrl` único (banco, questão, resolução), sem `as any`; descarta valores desconhecidos e prova incompatível com o ano |
| CR-12 | Corrigido em 2026-09-26 | Contagem de resultados em `role="status"` |
| CR-13 | Corrigido em 2026-09-26 | "Gabarito: X"; título "Resposta esperada"; barra fixa só ≥ 768 px; aviso da "Fase 6" trocado por "Resolução indisponível" em `<h2>` |
| CR-20 | Corrigido em 2026-09-26 | Por decisão do usuário: schema discriminado (objetiva = letra; discursiva = resumo não vazio) e regra `20-resolucoes.md` atualizada; conteúdo não alterado |
| CR-21 | Corrigido em 2026-09-26 | `candidatos_figuras.py` registra falhas do PyMuPDF com o número da página; comentário enganoso sobre expansão por rótulos corrigido |
| CR-22 | Corrigido em 2026-09-26 | `mapear_figuras_completo.py`: guard `__main__` e páginas com questões explícitas (a p.47 da Prova 1, com a figura da Q80, voltou a ser varrida) |
| CR-23 | Corrigido em 2026-09-26 | HTML escapado em `conferencia.ts` e `recortar.py` |
| CR-24 | Corrigido em 2026-09-26 | Validador e conferência leem só `questoes/`; pasta legada `questoes-discursivas/` vira erro de validação |
| CR-29 | Corrigido em 2026-09-26 | E2E: sair com o mouse fecha, clique fora fecha, Tab real, segundo toque e toque fora fecham; axe com `wcag22aa` nas telas de resolução e com o pop-up aberto |
| CR-30 | Corrigido em 2026-09-26 | `conferir-ui.spec.ts` só roda com `CONFERIR_UI=1`, com asserções em cada estado e sem `waitForTimeout` |
| CR-32 | Corrigido em 2026-09-26 | `tsconfig.scripts.json` (scripts, hooks, testes, `playwright.config.ts`) no `tsc -b`; `BlocoSchema` tipado como `z.ZodType<Bloco>` |
| CR-33 | Corrigido em 2026-09-26 | `Markdown.tsx`: uma varredura que preserva code spans e fórmulas; `\$` não abre fórmula. Limitação do remark-math: `\$` dentro de fórmula **inline** fecha a fórmula (o conteúdo só usa `\$` em display) |
| CR-34 | Corrigido em 2026-09-26 | Excluídos (autorizado pelo usuário) `src/App.css`, `src/index.css`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg`; imports sem uso removidos; teste tautológico substituído; script `npm run lint`. `@testing-library/user-event` mantido (usado pelo teste da busca) |
| CR-35 | Corrigido em 2026-09-26 | Por decisão do usuário: filtros extras mantidos e registrados no RF01 de `docs/ESPECIFICACAO.md` |
| CR-28 | Corrigido em 2026-09-26 | `playwright.config.ts`: `npm run build && npm run preview -- --port 4290 --strictPort`, `reuseExistingServer: false`. Verificado: sem `dist/` o E2E reconstrói e passa; com a 4290 ocupada falha com "is already used" |

**Histórico:** antes do CR-28, a porta 4173 estava ocupada pelo `vite preview` de outra cópia do projeto (`Enade_simulador - AGY`) e, com `reuseExistingServer`, os E2E rodavam contra o build dessa cópia sem aviso. Os resultados E2E de CR-09, CR-03 e CR-27 foram obtidos com uma config temporária em porta própria; os de CR-01/02/07/08 foram reexecutados depois dessa descoberta.

Testes da rodada de UI: `tests/unit/acessibilidade-navegacao.test.tsx` (10 casos) e conferência no navegador com `vite preview`.

Testes: `tests/unit/validador-integridade.test.ts` (18 casos sobre cópia temporária de `2025-prova1`) e casos 9/10b em `fase2-tdd.test.ts`. Não tratados na rodada do validador: CR-20 (schema do frontmatter das discursivas) e arquivo `public/figuras/2025-prova1/q032-teste.webp`, que fica fora do manifesto porque só o teste 6 o usa.

## Sumário executivo

O app compila sem erros, `content:validate --release` e `build` passam, e o `npm audit` não aponta vulnerabilidades. O `npm test` está **vermelho**: 1 de 29 testes falha, porque um teste depende de dados em `work/` que outro teste apaga.

Achados verificados:
- **Três defeitos de uso confirmados no navegador:** o skip-link leva à página 404, a marcação se perde em "Voltar à questão" e a busca descarta os espaços enquanto se digita.
- **Requisitos de acessibilidade da especificação não cumpridos:** as setas não navegam entre alternativas, "PORQUE" fica oculto para leitores de tela e o pop-up não é alcançável por Tab.
- **O validador de conteúdo, que é a barreira de segurança do projeto, não faz o que a seção 0.13 descreve:** a checagem da resposta cega nunca executa, `--release` aceita `verificacao: reprovada` e faltam as contagens, a figura órfã, o `textoBaseId` e a resolução obrigatória.
- **Um teste unitário destrói dados de `work/`.**

| Severidade | Quantidade |
|---|---|
| Crítica | 1 |
| Alta | 7 |
| Média | 10 |
| Baixa | 11 |
| Sugestão | 6 |
| **Total** | **35** |

## Resultado dos comandos

| Comando | Resultado | Observação |
|---|---|---|
| `npx tsc -p tsconfig.app.json --noEmit` | OK (exit 0) | Com `--strict` explícito também dá 0 erros (no TS 6, `strict` já é o padrão). |
| `npx tsc -p tsconfig.node.json --noEmit` | OK (exit 0) | Cobre apenas `vite.config.ts` (ver CR-32). |
| `npx oxlint` | exit 0, 19 avisos | Imports sem uso (`imageSize` em build.ts:3, `validarLatex` em validate.ts:12, `expect` em conferir-ui.spec.ts:1, vários em fase2-tdd), `no-useless-escape` nos hooks, TextoRico.tsx:28 e Markdown.tsx:18. |
| `npm test` | **FALHA** (exit 1): 28 passam, 1 falha | `comparar-cego.test.ts:11`: `expected undefined to be defined` (q032 ausente em `work/cego`; CR-25 e CR-26). |
| `npm run content:validate -- --release` | OK | "Validação de conteúdo aprovada com sucesso!" (mas ver CR-14 a CR-17). |
| `npm run build` | OK | Aviso do Vite: `index-DbxkzgOs.js` com 1.080,93 kB (330,50 kB gzip). Chunks das provas separados: 271,65 / 535,08 / 551,55 kB. |
| `npm audit --omit=dev` | 0 vulnerabilidades | — |
| `git status --short` | Sem mudança causada pela revisão | Apenas os arquivos já modificados antes. |
| Verificação extra no navegador | `vite preview` na porta 4179 + script Playwright | Confirmou CR-01, CR-02, CR-03, CR-04, CR-07, CR-09, CR-10 e CR-11. |

## Achados

### Correção / bugs do app

#### CR-01 — O skip-link leva à página 404 · Alta
- **Local:** `src/app/Layout.tsx:9`
- **Problema:** um âncora `#conteudo-principal` dentro de `createHashRouter` é interpretado como rota.
- **Evidência:** `<a href="#conteudo-principal" className="skip-link">`. No navegador, Tab e depois Enter resultaram em `url= http://localhost:4179/#conteudo-principal | h1= 404`.
- **Cenário de falha / impacto:** quem navega por teclado e usa o skip-link sai da página e cai em "Página não encontrada" (WCAG 2.4.1 quebrado).
- **Correção sugerida:** trocar por um `<button>` ou tratar o `onClick` com `preventDefault()` e `document.getElementById('conteudo-principal')?.focus()`, com `tabIndex={-1}` no `<main>`.

#### CR-02 — A marcação se perde em "Voltar à questão" · Alta
- **Local:** `src/features/questao/PaginaQuestao.tsx:24-29`; `src/features/resolucao/PaginaResolucao.tsx:159`
- **Problema:** a especificação 0.9 pede que "Voltar à questão" mantenha a marcação. O link repassa `?marcada=B`, mas `PaginaQuestao` nunca lê esse parâmetro: o estado começa em `null` e é zerado por um efeito.
- **Evidência:** `const [alternativaMarcada, setAlternativaMarcada] = useState<Letra | null>(null);` e `useEffect(() => { setAlternativaMarcada(null); }, [questaoId]);`. O grep por `marcada` em `src` não encontra leitura em PaginaQuestao. No navegador: `url apos voltar: …/questao/2025-prova1-q032?marcada=B` e `aria-checked: ['false','false','false','false']`.
- **Cenário de falha / impacto:** a pessoa marca B, confere o gabarito, volta e a marcação sumiu. Além disso, os links Anterior/Próxima propagam o `marcada=B` antigo para outras questões.
- **Correção sugerida:** inicializar e sincronizar o estado a partir de `searchParams.get('marcada')`, validando a letra, e remover `marcada` da query dos links Anterior/Próxima.

#### CR-03 — A busca descarta os espaços durante a digitação · Média
- **Local:** `src/features/banco/PaginaBanco.tsx:52`; `src/features/banco/Filtros.tsx:185`
- **Problema:** o input é controlado pela URL, e a URL grava o termo com `trim()` a cada tecla.
- **Evidência:** `if (novos.termo && novos.termo.trim() !== '') params.set('termo', novos.termo.trim());` com `value={termoAtual}`. No navegador, digitar "matriz inversa" deixa o campo com `"matrizinversa"`.
- **Cenário de falha / impacto:** é impossível buscar termos com mais de uma palavra.
- **Correção sugerida:** manter o texto digitado em estado local (ou gravar sem `trim`) e aplicar `trim` só no filtro.

#### CR-04 — `?marcada=` não é validado · Baixa
- **Local:** `src/features/resolucao/PaginaResolucao.tsx:33`
- **Evidência:** `const alternativaMarcada = (searchParams.get('marcada') as Letra) || null;`. No navegador, `?marcada=Z` mostra `✗Você marcou Z — incorreta`.
- **Cenário de falha / impacto:** uma URL editada ou colada mostra feedback absurdo (letra inexistente, ou "E" numa prova de 4 alternativas).
- **Correção sugerida:** aceitar apenas letras presentes em `questao.alternativas`.

#### CR-05 — Carregamento sem cancelamento: uma resposta antiga pode sobrescrever a nova · Baixa
- **Local:** `src/features/questao/PaginaQuestao.tsx:32-50`; `src/features/resolucao/PaginaResolucao.tsx:35-53`
- **Evidência:** `Promise.all([carregarQuestao(questaoId), carregarIndice()]).then(([dadosQuestao, …]) => { setQuestao(…) …` sem flag de cancelamento no cleanup.
- **Cenário de falha / impacto:** ao passar da última questão de 2021 para uma de 2025-prova1 (JSON ainda não carregado) e clicar logo em "Anterior", a questão de 2021 (já em cache) resolve primeiro e a de 2025 chega depois e sobrescreve a tela.
- **Correção sugerida:** usar `let ativo = true; … return () => { ativo = false }` e só aplicar o `set*` se `ativo`.

#### CR-06 — Parâmetros de filtro sem saneamento e casts `as any` · Baixa
- **Local:** `src/features/questao/PaginaQuestao.tsx:66-68`; `src/features/resolucao/PaginaResolucao.tsx:69-71`; `src/features/banco/PaginaBanco.tsx:37-40`
- **Evidência:** `provaId: (provaParam as any) || 'todas'`, e `ano: … Number(anoParam)` (`ano=abc` vira `NaN`).
- **Cenário de falha / impacto:** `#/?ano=2021&prova=2025-prova1` dá 0 resultados, e o `<select>` fica com um valor que não existe nas opções. A mesma lógica de parse está triplicada.
- **Correção sugerida:** criar uma função única `lerFiltrosDaUrl(searchParams)` que valide contra listas conhecidas, sem `any`.

### Acessibilidade / conformidade com a especificação

#### CR-07 — As alternativas não navegam por setas e todas ficam na ordem de Tab · Alta
- **Local:** `src/components/ConteudoQuestao.tsx:34-40, 75`
- **Problema:** a especificação 0.9 pede "setas navegam" no `role="radiogroup"`. O handler só trata Enter e Espaço, e todo radio recebe `tabIndex=0` (sem *roving tabindex*).
- **Evidência:** `if (e.key === 'Enter' || e.key === ' ') {` e `tabIndex={somenteLeitura ? undefined : 0}`. No navegador, ArrowDown mantém o foco em A, com tabindex `[0,0,0,0]`.
- **Cenário de falha / impacto:** o padrão ARIA de radio fica quebrado para leitores de tela e teclado.
- **Correção sugerida:** implementar ArrowUp/Down/Left/Right movendo o foco e usar `tabIndex` 0 só no item marcado (ou no primeiro, se nenhum) e -1 nos demais.

#### CR-08 — O conectivo "PORQUE" está oculto para leitores de tela · Alta
- **Local:** `src/components/Blocos.tsx:79`
- **Evidência:** `<div key={idx} className={styles.blocoConectivo} aria-hidden="true">{bloco.texto}</div>`. 8 arquivos de questão usam `conectivo`.
- **Cenário de falha / impacto:** nas questões de asserção-razão, o leitor de tela lê a asserção I e a II sem o "PORQUE", o que muda o sentido da questão.
- **Correção sugerida:** remover o `aria-hidden`.

#### CR-09 — O pop-up não é alcançável por Tab e fecha ao perder o foco · Média
- **Local:** `src/features/resolucao/PopupQuestao.tsx:45, 77-86`
- **Problema:** o pop-up é renderizado num `FloatingPortal` no fim do `body`, sem `FloatingFocusManager`. Com `useFocus`, o Tab tira o foco do gatilho, o pop-up fecha e o foco vai para o próximo elemento da página.
- **Evidência:** saída do navegador: `dialogo visivel apos Tab: 0 | foco em: ← Voltar à questão`.
- **Cenário de falha / impacto:** quem usa teclado não alcança o botão "Fechar" nem consegue rolar o conteúdo, que tem `overflow-y: auto`.
- **Correção sugerida:** envolver o conteúdo em `<FloatingFocusManager context={context} modal={false} initialFocus={-1}>`, que devolve a ordem de Tab sem aprisionar o foco.

#### CR-10 — A prévia do banco mostra LaTeX cru · Média
- **Local:** `scripts/content/build.ts:15`
- **Problema:** `extrairPrevia` remove os delimitadores `$` e as barras invertidas, então o `TextoRico` não renderiza mais as fórmulas. A especificação (RF02/0.9) pede "fórmulas renderizadas inline".
- **Evidência:** `b.texto.replace(/\$([^$]+)\$/g, '$1').replace(/\\([a-zA-Z]+)/g, '$1')`. O `indice.json` gerado contém, por exemplo, `x : mathbb{N} to mathbb{R}` (2021-d04) e `frac{dS}{dt} = rS + k` (2021-q020); o mesmo texto aparece na lista no navegador.
- **Cenário de falha / impacto:** os cards mostram lixo textual (`mathbb`, `frac`, `x_n`). O corte em 137 caracteres também pode partir `**` pela metade.
- **Correção sugerida:** manter o `$…$` e cortar respeitando pares de `$`/`**` (fechar ou recuar o corte antes de uma fórmula).

#### CR-11 — Imagens sem `width`/`height`; o build não calcula as dimensões · Média
- **Local:** `src/components/Blocos.tsx:123-129`; `scripts/content/build.ts:3`
- **Problema:** RNF03 e a seção 0.13 pedem WebP com `width`/`height` e dimensões via `image-size` no JSON gerado. `imageSize` é importado e nunca usado.
- **Evidência:** `<img src={imgSrc} alt={bloco.alt} loading="lazy" style=… />`. No navegador, 2025-prova1-q050 dá `[null, null, 'lazy']` para as 4 imagens.
- **Cenário de falha / impacto:** layout shift (CLS) ao carregar as figuras.
- **Correção sugerida:** no build, anotar `largura`/`altura` em cada bloco `imagem` e repassar como atributos no `<img>`.

#### CR-12 — A contagem de resultados do filtro não é anunciada · Baixa
- **Local:** `src/features/banco/Filtros.tsx:193-195`
- **Evidência:** `<div><strong>{totalQuestoes}</strong> {… 'questões encontradas'}</div>`, sem `aria-live` nem `role="status"`.
- **Cenário de falha / impacto:** quem usa leitor de tela não percebe o efeito do filtro (WCAG 4.1.3).
- **Correção sugerida:** adicionar `role="status"` (ou `aria-live="polite"`) nesse contêiner.

#### CR-13 — Pequenas divergências de texto e layout em relação à especificação · Sugestão
- **Local:** `src/features/resolucao/CartaoGabarito.tsx:39, 21`; `src/features/resolucao/PaginaResolucao.module.css:8-17`; `src/features/resolucao/PaginaResolucao.tsx:147-153`
- **Evidência:**
  - O cartão diz `Gabarito oficial:`, e a especificação pede "Gabarito: D".
  - A discursiva usa "Padrão de Resposta Esperado"; a especificação pede o título "Resposta esperada".
  - `.barraFixaSuperior { position: sticky; …}` vale em qualquer largura; a especificação pede ≥ 768 px.
  - O aviso "será incluída na **Fase 6**" é código morto, porque as 202 resoluções existem, e usa `<h3>` logo após o `<h1>`.
- **Correção sugerida:** alinhar os textos, pôr o sticky dentro de `@media (min-width: 768px)` e remover o aviso.

### Pipeline de conteúdo

#### CR-14 — A checagem "resposta cega × `respostaIndependente`" nunca executa · Alta
- **Local:** `scripts/content/validate.ts:125-126` (chamado em 345 e 257)
- **Problema:** o validador monta o caminho do arquivo cego com o nome da resolução (`q032.md`), mas os arquivos cegos são `.json`. Só o teste unitário passa `arquivoNome: 'q032.json'`.
- **Evidência:** `const arquivoBase = info.arquivoNome || …; const cegoFile = path.resolve(RAIZ, 'work/cego', info.provaId, arquivoBase);` com `{ …, arquivoNome: f }`, onde `f = 'q032.md'`. Comparação feita à parte com gray-matter: 201 pares e **7 divergências** não detectadas (as 5 discursivas de 2021, com `respostaIndependente` em texto livre contra `"discursiva"` no arquivo cego, mais 2025-prova1/d01 e 2025-prova5/d01).
- **Cenário de falha / impacto:** o protocolo anti-erro (Regra 20, passo 1) fica desligado sem aviso. Uma `respostaIndependente` editada depois de ver o gabarito passa.
- **Correção sugerida:** usar `f.replace(/\.md$/, '.json')` e definir a regra de comparação para discursivas.

#### CR-15 — `--release` aceita `verificacao: reprovada` · Alta
- **Local:** `scripts/content/validate.ts:142`
- **Evidência:** `if (opts.release && data.verificacao === 'pendente') {`
- **Cenário de falha / impacto:** uma resolução reprovada pelo verificador passa no gate de publicação. A seção 0.13, item 9, exige `aprovada`.
- **Correção sugerida:** `if (opts.release && data.verificacao !== 'aprovada')`.

#### CR-16 — O validador não cumpre vários itens da especificação 0.13 · Alta
- **Local:** `scripts/content/validate.ts:80-90, 266-354`; `scripts/content/schema.ts:254`
- **Problema:** faltam as seguintes checagens:
  - **(2)** as contagens 35+5 e 80+1;
  - **(4)** gabarito "idêntico": só compara quando a chave existe, então chave ausente passa;
  - **(5)** figura órfã e `status ≠ pendente` (o schema aceita `pendente`);
  - **(8)** `textoBaseId` existe e o texto-base lista a questão;
  - **(9)** existência de uma resolução para cada questão;
  - coerência entre `id`, `provaId` e `numero` com o nome do arquivo.
- **Evidência:** `if (letraGabarito && letraGabarito !== letraEsperada) {` (linha 84); o laço de resoluções só percorre os `.md` existentes (linhas 333-352); não há nenhuma referência a `textoBaseId` em validate.ts.
- **Cenário de falha / impacto:** apagar uma questão, uma resolução ou a chave "32" do gabarito, ou apontar `textoBaseId` para um texto inexistente, continua dando "Validação aprovada". O app então exibe "Gabarito oficial: —" ou o aviso de "Fase 6".
- **Correção sugerida:** implementar essas checagens em `executarValidacaoCompleta`, com testes.

#### CR-17 — `--prova` com id inexistente é aprovado · Média
- **Local:** `scripts/content/validate.ts:269`
- **Evidência:** `if (!fs.existsSync(provaDir)) continue;`. `npx tsx scripts/content/validate.ts --prova 2025-prova9` imprime "Validação de conteúdo aprovada com sucesso!" com exit 0.
- **Cenário de falha / impacto:** um erro de digitação no lote dá um falso "validado". Com `--arquivo`, um `.json` não reconhecido também passa sem validação (linhas 215-233), e um `.md` fora de `provas/` cai em `'2025-prova1'` (linha 241).
- **Correção sugerida:** validar o id contra `ProvaIdSchema` e falhar em caso de pasta ausente ou tipo de arquivo desconhecido.

#### CR-18 — A "dupla leitura" do gabarito da Prova 1 é tautológica · Média
- **Local:** `scripts/pdf/extrair_gabaritos.py:97`
- **Evidência:** `gabarito_p1[str(i)] = objetivas.get(str(i), REFERENCIA_2025_P1[i - 1])`, seguido da comparação com a mesma `REFERENCIA_2025_P1` (linha 120).
- **Cenário de falha / impacto:** qualquer questão que o regex não extraia recebe a própria referência, então `div_p1` é sempre 0. Com PDF sem camada de texto, o resultado é 100% a referência. Divergências também não geram exit code diferente de 0 (`return` nas linhas 116/124/132).
- **Correção sugerida:** registrar as questões não extraídas como "não lido", exigir conferência visual explícita e usar `sys.exit(1)` em caso de divergência.

#### CR-19 — O hook de validação ignora caminhos com barra invertida; as cópias divergem · Média
- **Local:** `scripts/hooks/antigravity-validar.mjs:32`; `scripts/hooks/antigravity-proteger.mjs:10` × `.agents/scripts/hooks/antigravity-proteger.mjs:10`
- **Evidência:** `/(?:[A-Za-z]:[\/][^\s"'`]+[\/])?content[\/][^\s"'`*?:()]+\.(?:json|md)/gi`, em que `[\/]` só casa `/`. A cópia em `.agents/` verifica `../work/cego/BLOQUEIO` e a de `scripts/hooks` não.
- **Cenário de falha / impacto:** no Windows, uma edição relatada como `C:\…\content\provas\…` não dispara validação nenhuma, e o hook sai com 0. Dependendo da cópia registrada, o bloqueio do gabarito durante a etapa cega funciona ou não.
- **Correção sugerida:** usar `[\\/]` no regex e manter uma única fonte (a outra cópia importando ou sendo gerada).

#### CR-20 — O frontmatter das discursivas foge do contrato, e o schema aceita qualquer string · Baixa
- **Local:** `scripts/content/schema.ts:259-266`
- **Evidência:** `respostaIndependente: z.string(), respostaFinal: z.string()`. `content/provas/2021-licenciatura/resolucoes/d01.md:3` traz `respostaIndependente: "Relação dialética entre cultura…"`, enquanto `.agents/rules/20-resolucoes.md` define `respostaIndependente: discursiva`.
- **Correção sugerida:** criar um schema discriminado (Letra para objetivas, literal `discursiva` para discursivas).

#### CR-21 — `candidatos_figuras.py` engole exceções · Baixa
- **Local:** `scripts/pdf/candidatos_figuras.py:258-259, 289-290`
- **Evidência:** `except Exception:\n        pass`
- **Cenário de falha / impacto:** um erro do PyMuPDF numa página resulta em "0 candidatos" silencioso, e uma figura pode ser esquecida. A heurística da especificação 0.10 também está ausente: a expansão por spans de texto é só um comentário (linha 283).
- **Correção sugerida:** registrar o erro com o número da página e continuar.

#### CR-22 — `mapear_figuras_completo.py` roda ao ser importado e pula a p. 47 da 2025-prova1 · Baixa
- **Local:** `scripts/pdf/mapear_figuras_completo.py:23, 49-51`
- **Evidência:** `if num_pag == 1 or num_pag >= len(doc) - 1: continue` (com 48 páginas, pula a 47, onde está a Q80) e o `for p in [...]` em nível de módulo, sem `if __name__ == "__main__"`.
- **Correção sugerida:** usar as páginas excluídas explícitas da especificação 0.1 e adicionar o guard.

#### CR-23 — As folhas de conferência interpolam conteúdo sem escapar HTML · Baixa
- **Local:** `scripts/content/conferencia.ts:46`; `scripts/pdf/recortar.py:47-54`
- **Evidência:** `<pre><code>${JSON.stringify(q, null, 2)}</code></pre>`. 5 arquivos de questão contêm `<`.
- **Cenário de falha / impacto:** a folha local renderiza trechos como tags e esconde partes da transcrição justamente na conferência visual.
- **Correção sugerida:** escapar `& < >` (e `html.escape` no Python).

#### CR-24 — Leitura inconsistente de `questoes-discursivas/` · Sugestão
- **Local:** `scripts/content/build.ts:59`; `scripts/content/validate.ts:316`; `scripts/content/conferencia.ts:24`
- **Evidência:** o build lê só `questoes/`; o validador e a conferência também leem `questoes-discursivas/`.
- **Correção sugerida:** remover o caminho legado ou tratá-lo igualmente nos três scripts.

### Testes

#### CR-25 — Um teste unitário sobrescreve e apaga dados reais de `work/cego` · Crítica
- **Local:** `tests/unit/fase2-tdd.test.ts:129-151`
- **Evidência:** `fs.writeFileSync(cegoFile, JSON.stringify({ … resposta: 'C' … }))`, seguido de `finally { if (fs.existsSync(cegoFile)) fs.unlinkSync(cegoFile); }`, com `cegoFile = work/cego/2025-prova1/q032.json`, o arquivo real.
- **Cenário de falha / impacto:** perda de dados. Cada `npm test` destrói o registro da etapa cega da q032. Isso aconteceu nesta revisão (arquivo restaurado; ver aviso no topo). Consequência direta: `comparar-cego.test.ts` passa a falhar.
- **Correção sugerida:** usar um diretório temporário (`fs.mkdtempSync(os.tmpdir())`) e injetar a raiz em `validarResolucaoMarkdown`, ou fazer backup e restauração do arquivo.

#### CR-26 — `comparar-cego.test.ts` depende de `work/` (gitignored) e grava relatório · Média
- **Local:** `tests/unit/comparar-cego.test.ts:6-17`
- **Evidência:** `executarComparacaoCega('2025-prova1')` lê `work/cego`; `salvarRelatorioCego(res)` escreve em `work/relatorios`.
- **Cenário de falha / impacto:** falha num clone limpo, falha após CR-25 e tem efeito colateral em arquivos de trabalho.
- **Correção sugerida:** usar fixtures em `scripts/content/__fixtures__` e diretório temporário.

#### CR-27 — A varredura das 202 questões pode validar um DOM antigo e não confere imagens · Média
- **Local:** `tests/e2e/smoke-todas.spec.ts:85-95` (trecho novo do diff)
- **Evidência:** `await page.goto(`/#/questao/${item.id}`); await expect(page.locator('h1')).toBeVisible(); await expect(page.locator('.katex-error')).toHaveCount(0);`
- **Cenário de falha / impacto:** `goto` que só troca o hash é uma navegação no mesmo documento. O `h1` da tela anterior satisfaz `toBeVisible` antes do novo render, então `.katex-error` pode ser checado na página errada. A especificação 0.13 também pede `naturalWidth > 0` para as 202 questões, e a varredura não verifica imagens.
- **Correção sugerida:** esperar `h1` com o texto `item.rotulo` (ou `Resolução · ${item.rotulo}`) e checar as imagens, com `waitForLoadState` ou `img.complete`.

#### CR-28 — O Playwright serve um `dist/` sem rebuild · Baixa
- **Local:** `playwright.config.ts:34-38`
- **Evidência:** `command: 'npm run preview -- --port 4173', … reuseExistingServer: !process.env.CI`
- **Cenário de falha / impacto:** os E2E rodam contra um build desatualizado depois de mudanças em `src/` ou `content/`.
- **Correção sugerida:** `command: 'npm run build && npm run preview -- --port 4173'`.

#### CR-29 — Lacunas de cobertura no pop-up, no toque e no axe · Baixa
- **Local:** `tests/e2e/popup.spec.ts:23-30, 41-42`; `tests/e2e/toque.spec.ts:16-27`; `tests/e2e/acessibilidade.spec.ts:10`
- **Evidência:**
  - O pop-up nunca testa "sair fecha" nem o clique fora, e usa `.focus()` em vez de Tab real, por isso CR-09 passou.
  - O toque não testa o segundo toque (fechar) nem o toque fora.
  - O axe usa `withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])`, sem `wcag22aa` e sem as telas de resolução ou pop-up.
- **Correção sugerida:** acrescentar esses casos.

#### CR-30 — `conferir-ui.spec.ts` não tem asserções · Sugestão
- **Local:** `tests/e2e/conferir-ui.spec.ts:1, 42, 57`
- **Evidência:** importa `expect` sem usar; `await page.waitForTimeout(300);`; grava PNGs em `work/` a cada `npm run test:e2e`.
- **Correção sugerida:** mover para o script `scripts/conferir_ui_screenshots.ts`, que já faz o mesmo, ou marcar com `test.describe.configure({ mode: 'serial' })` e tag `@manual`.

### TypeScript / Configuração / Performance / Código morto

#### CR-31 — Chunk principal de 1,08 MB, sem lazy por rota · Média
- **Local:** `src/app/router.tsx:3-5`; `src/components/Markdown.tsx:2-5`
- **Evidência:** saída do build `dist/assets/index-DbxkzgOs.js 1,080.93 kB │ gzip: 330.50 kB`. As três páginas, react-markdown, remark/rehype, katex e floating-ui são importados estaticamente.
- **Cenário de falha / impacto:** o banco (primeira tela) baixa o pipeline de Markdown e o pop-up sem usar, o que ameaça a meta LCP < 2,5 s em 4G (RNF03) e Lighthouse ≥ 85.
- **Correção sugerida:** usar `lazy` de rota (`route.lazy`) para `PaginaResolucao` e `PaginaQuestao`.

#### CR-32 — `scripts/`, `tests/` e `playwright.config.ts` estão fora de qualquer tsconfig · Baixa
- **Local:** `tsconfig.node.json:22`; `tsconfig.app.json:25`
- **Evidência:** `"include": ["vite.config.ts"]` e `"include": ["src"]`. Um `tsc --strict` avulso sobre esses arquivos acusa `tests/e2e/filtros.spec.ts(12,25): Property 'value' does not exist on type 'HTMLElement | SVGElement'` e `tests/e2e/smoke-todas.spec.ts(72,53): Parameter 'q' implicitly has an 'any' type`. O `BlocoSchema: z.ZodType<any>` (schema.ts:88) também torna `any` todos os tipos inferidos do schema.
- **Correção sugerida:** criar um `tsconfig.scripts.json` e incluí-lo no `tsc -b`.

#### CR-33 — `Markdown.tsx` (diff): `&#36;` aparece literal em code spans · Sugestão
- **Local:** `src/components/Markdown.tsx:25`
- **Evidência:** `return parte.replace(/R\\\$/g, 'R&#36;').replace(/\\\$/g, '&#36;');`
- **Cenário de falha / impacto:** pelo CommonMark, referências de entidade não são decodificadas dentro de `` `…` ``, então um `` `R\$` `` apareceria como `R&#36;`. Nenhuma resolução atual tem esse caso. A troca é segura nos casos existentes, por exemplo `\text{R\$ } 400{,}00` dentro de `$$…$$` em 2021/q014.md:40 é preservado.
- **Correção sugerida:** deixar o micromark tratar o escape `\$`, que já é um escape CommonMark válido, ou excluir code spans do split.

#### CR-34 — Código morto e dependências sem uso · Sugestão
- **Local:** `src/App.css`, `src/index.css`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg` (nenhum é importado ou referenciado); `package.json:31` (`@testing-library/user-event` sem uso); `scripts/content/build.ts:3`; `scripts/content/validate.ts:12`; `tests/unit/basico.test.ts:5` (`expect(true).toBe(true)`, tautológico); sem script `lint` para o `oxlint`.
- **Correção sugerida:** remover os arquivos e dependências e adicionar `"lint": "oxlint"`.

#### CR-35 — Filtros e busca além da especificação · Sugestão
- **Local:** `src/features/banco/Filtros.tsx:142-189`; `src/data/filtrar.ts:41-59`
- **Evidência:** existem os selects "Componente" e "Tipo de Questão" e a busca por termo. RF01 especifica apenas Ano e Prova (regra inviolável 8: nada fora da especificação).
- **Correção sugerida:** confirmar com o usuário se ficam; se ficarem, registrar na especificação.

## Verificado sem problemas

- `createHashRouter` (router.tsx:8), `base: './'` (vite.config.ts:6) e `normalizarSrcImagem` usando `BASE_URL` funcionam sem servidor. A rota `*` existe.
- Nenhum `localStorage`, `sessionStorage` ou cookie em `src/`. O rascunho da discursiva fica só em `useState`.
- `PopupQuestao`: `delay { open: 120, close: 200 }`, `safePolygon()`, `useFocus`, `useClick`, `useDismiss({ escapeKey, outsidePress })`, `useRole('dialog')`, `aria-haspopup`, `aria-expanded`, `aria-label="Enunciado da …"`, botão "Fechar", `offset(8)`/`flip`/`shift({padding: 8})`, `width: min(720px, 92vw)`, `max-height: 70vh` e animação zerada por `prefers-reduced-motion` (tokens.css:111).
- Sem `rehype-raw`, sem `target=_blank` e sem URLs de usuário. `dangerouslySetInnerHTML` recebe apenas a saída do KaTeX.
- O KaTeX do validador usa `throwOnError: true` e cobre questões e resoluções. `content:validate --release` passou.
- `gabaritos-referencia.ts` e `extrair_gabaritos.py` batem letra a letra com a especificação 0.7. O índice gerado tem 202 questões (35+5, 80+1, 80+1).
- `index.html` com `lang="pt-BR"`, viewport e título corretos. `public/favicon.svg` existe.
- Foco visível global (`:focus-visible`, 3 px). Tema escuro via `prefers-color-scheme`. Tabelas com rolagem própria.
- Cada prova vira um chunk JSON separado via `import()` dinâmico (carregar.ts), com cache em memória.
- `filtrarQuestoes` e `vizinhas`: ordenação e bordas corretas, com testes unitários.
- `npm audit`: 0 vulnerabilidades.

## Top 10 prioridades

1. **CR-25** — Um teste apaga dados reais a cada `npm test`; foi o que tornou a suíte vermelha.
2. **CR-14** — A checagem da etapa cega do protocolo anti-erro está morta.
3. **CR-15** — O gate de release aceita resoluções reprovadas.
4. **CR-16** — O validador não cumpre a seção 0.13, e remoções de conteúdo passam como "aprovadas".
5. **CR-01** — O skip-link manda o usuário de teclado para a 404.
6. **CR-02** — A marcação se perde em "Voltar à questão" (especificação 0.9).
7. **CR-08** — "PORQUE" fica oculto para leitores de tela em 8 questões de asserção-razão.
8. **CR-07** — O radiogroup não navega por setas (especificação 0.9, ARIA).
9. **CR-09** — O pop-up fica inacessível pelo teclado além de abrir e fechar.
10. **CR-27** — A varredura das 202 questões pode passar olhando o DOM errado, e é a prova de "zero `.katex-error`".
