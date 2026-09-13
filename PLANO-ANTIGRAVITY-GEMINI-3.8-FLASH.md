# Plano B — Simulador ENADE Matemática (Licenciatura) 2021 e 2025
## Execução com Google Antigravity + Gemini 3.8 Flash

> Plano autossuficiente: **Parte 0** (especificação comum do produto) + **Parte B** (execução no Antigravity) + **Verificação ponta a ponta**.
> Plano irmão, que constrói o mesmo produto: `planos/PLANO-A-CLAUDE-OPUS-5.md`.

## Contexto

A pasta `C:\Users\Raildo Lima\Desktop\Enade_simulador` contém 6 PDFs do ENADE de Matemática – Licenciatura (3 provas + 3 gabaritos, 2021 e 2025). O objetivo é um **webapp estático no navegador** para estudantes treinarem as questões: filtros por ano e prova, figuras recortadas dos PDFs, botão **"Ver gabarito"** que leva à **tela de resolução comentada**, na qual o botão **"Ver questão"** mostra o enunciado em pop-up ao passar o mouse.

O maior valor — e o maior risco — está em: (1) transcrição fiel de 202 questões com fórmulas e figuras; (2) resoluções matematicamente corretas e didáticas para todas elas. Por isso os planos investem pesado em pipeline reprodutível, validação automática e verificação independente.

## Decisões confirmadas com o usuário

| Tema | Decisão |
|---|---|
| Escopo | **Todas** as questões: Formação Geral + Componente Específico, objetivas e discursivas (202) |
| Acesso | **Site estático online** (GitHub Pages/Netlify/Vercel); roda localmente para testes |
| Marcação | Estudante **pode marcar** uma alternativa (opcional); **nada é salvo** |
| Resoluções | Passo a passo + **análise de todas as alternativas/afirmativas incorretas** |
| Discursivas | Botão "Ver resposta esperada" → resposta-modelo comentada (os PDFs não trazem padrão de resposta: gabarito "***") |

## Como usar este plano

- **Parte 0** é o contrato do produto (dados, telas, padrões e testes). Na Fase 0 ela é copiada para `docs/ESPECIFICACAO.md`.
- **Parte B** traz a configuração do Antigravity (AGENTS.md, regras, skills, subagentes, hooks) e as 8 fases com prompts prontos. Uma conversa em modo Planning por fase (ou por trilha), na ordem, respeitando os checkpoints 🛑.
- Menções ao "Plano A" são apenas comparativas.

---

# PARTE 0 — Especificação comum

## 0.1 Inventário verificado dos PDFs

| provaId | Prova | Págs | Página (pt) | Estrutura | Gabarito |
|---|---|---|---|---|---|
| `2021-licenciatura` | `2021 - Matemática - Licenciatura - Prova.pdf` | 40 | 566,9 × 779,5 | FG: Discursivas D1–D2, Objetivas 1–8 · CE: Discursivas D3–D5, Objetivas 9–35 · **5 alternativas (A–E)** · discursiva ≤ 15 linhas | `2021 - Matemática - Licenciatura - Gabarito.pdf` — 1 pág., texto extraível |
| `2025-prova1` | `2025 - Matemática - Prova 1.pdf` (Caderno 1401, Tipo 01, 1ª aplicação) | 48 | 636,6 × 849,2 (com marcas de corte) | Formação Geral Docente: Objetivas 01–30 + 1 Discursiva · CE: Objetivas 31–80 · **4 alternativas (A–D)** · discursiva ≤ 30 linhas | `2025 - Matemática - Gabarito 1.pdf` — 1 pág. paisagem; **tabela sem camada de texto confiável** (leitura visual) |
| `2025-prova5` | `2025 - Matemática - Prova 5 (2ª Aplicação).pdf` (Caderno 1405, Tipo 05) | 48 | 566,9 × 779,5 | Igual à Prova 1, mas com **questões diferentes** | `2025 - Matemática - Gabarito 5 (2ª Aplicação).pdf` — texto extraível, colunas intercaladas |

**Totais:** 195 objetivas + 7 discursivas = **202 questões**.
**Excluir:** capa/instruções, "RASCUNHO", "Área livre", Questionário de Percepção (2021 p.36; 2025-prova1 p.48; 2025-prova5 p.47), páginas em branco.

**Achados que afetam a execução:**
- Figuras **raster** (fotos, charges, gráficos, infográficos) aparecem em `pdfimages -list`/PyMuPDF. Figuras **vetoriais** (ex.: 2021 Q9 gráfico, Q10 gráficos, Q11 elipse, Q22 tabuleiro) **não** são imagens: exigem renderizar a página e recortar por coordenadas.
- Página 1 das provas 2025 tem 171 miniaturas decorativas; cabeçalhos têm logotipos e código de barras; 2025-prova1 tem marcas de corte e texto "R14012025 - MATEMATICA.indb" nas bordas — nada disso entra em recortes.
- Layout em 1 ou 2 colunas; questões atravessam páginas (2021 Q2 p.6–7, Q5 p.10–11, Q22 p.24–25; 2025-prova1 Q58 p.33–34).
- Textos-base compartilhados ("Texto para questões 35 a 37").
- **Alternativas que são imagens** em grade 2×2 com ordem **A, C (em cima) / B, D (embaixo)**: 2025-prova1 Q50 e Q79. Alternativas com fórmulas/matrizes: 2021 Q12, 2025-prova1 Q51, 2025-prova5 Q66.
- `pdftotext` corrompe fórmulas (ex.: "T : 2 ® 2" = $T:\mathbb{R}^2\to\mathbb{R}^2$) → fórmulas são transcritas por **leitura visual**. Há troca de símbolo na diagramação (2021 D4 usa "∈" no lugar de "ε").
- Inconsistências que a resolução deve explicar **sem alterar o gabarito**: 2025-prova1 Q31–32 (texto diz "escala 1 : 20", a escala gráfica mostra 1 cm = 20 m); 2025-prova5 Q50 (cálculo exato ≈ 10,9 dias; o gabarito "14 dias" decorre de arredondar k ≈ 0,1); 2025-prova5 Q68 (leitura modal de "pode ser" na alternativa D).
- Amostra de ~40 questões resolvidas no planejamento: **todas coincidiram com os gabaritos lidos** (seção 0.7).

**Ambiente verificado (Windows 11):** Python 3.14.3 (`py`), Node 24.13.1, npm 11.8.0, Git 2.53, Poppler via MiKTeX (`pdfinfo`, `pdftoppm`, `pdftotext`, `pdfimages`, `pdftocairo`). **Não instalados:** PyMuPDF, Pillow, NumPy, SymPy (instalar em `.venv`). A pasta ainda **não é repositório git**. Antigravity instalado (`~/.gemini/antigravity`).

## 0.2 Requisitos funcionais

- **RF01** Banco de questões com filtros **Ano** (Todos, 2021, 2025) e **Prova** (dependente do ano: "2021 · Licenciatura", "2025 · Prova 1 (1ª aplicação)", "2025 · Prova 5 (2ª aplicação)"). Filtros refletidos na URL.
- **RF02** Lista das questões filtradas: rótulo, badge Parte (Formação Geral/Componente Específico), badge Tipo (Objetiva/Discursiva), prévia de 1 linha.
- **RF03** Tela da questão: texto-base (se houver), enunciado com fórmulas e figuras, alternativas; "Anterior"/"Próxima" dentro do filtro; "Voltar ao banco".
- **RF04** Marcação opcional de uma alternativa (clicar de novo desmarca). Sem persistência (sem localStorage).
- **RF05** Botão **"Ver gabarito"** (objetivas) / **"Ver resposta esperada"** (discursivas) → navega para a tela de resolução.
- **RF06** Tela de resolução: cartão "Gabarito: X" com **somente a alternativa correta** (letra + conteúdo); se houve marcação, "Você marcou Y — correta/incorreta" (texto + ícone, não só cor); resolução comentada completa.
- **RF07** Botão **"Ver questão"** na tela de resolução: ao passar o mouse abre pop-up com a questão completa (texto-base, enunciado, figuras, alternativas), somente leitura; permanece aberto enquanto o ponteiro entra no pop-up; rolagem interna; fecha ao sair, com Esc ou clique fora; abre também por foco de teclado; em telas de toque, toque abre/fecha e há botão "Fechar".
- **RF08** Discursivas: itens (a, b, c) com valores; campo de rascunho opcional **não salvo**; resolução = resposta esperada + critérios + exemplo de resposta.
- **RF09** Rodapé: "Questões: INEP/MEC — ENADE 2021 e 2025. Resoluções elaboradas para fins educacionais. Site não oficial." Créditos das fontes das figuras preservados.

## 0.3 Requisitos não funcionais

- **RNF01** 100% estático, sem backend; roteamento por hash (funciona em qualquer hospedagem e subpasta).
- **RNF02** Responsivo (360–1920 px); acessível (WCAG 2.2 AA: contraste, teclado, foco visível, `alt` descritivo, `lang="pt-BR"`).
- **RNF03** Desempenho: JSON de cada prova carregado sob demanda (`import()` dinâmico); imagens WebP com `width`/`height` e `loading="lazy"`; LCP < 2,5 s (4G simulado).
- **RNF04** Matemática em KaTeX; **zero** `.katex-error` em produção.
- **RNF05** Conteúdo em pt-BR; decimal com vírgula em LaTeX (`1{,}44`).
- **RNF06** Reprodutibilidade: recortes regeráveis por script a partir de manifesto; conteúdo validado por script; sem logotipos oficiais do INEP/ENADE (o site não se apresenta como oficial).

## 0.4 Stack (decidida)

| Camada | Escolha | Motivo |
|---|---|---|
| App | Vite (`react-ts`, versão estável mais recente) + React + TypeScript `strict` | SPA estática, build simples |
| Rotas | `react-router` com `createHashRouter` | hospedagem estática sem rewrite |
| Matemática/Markdown | `katex`, `react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm` | resoluções em Markdown com LaTeX |
| Pop-up | `@floating-ui/react` (`useHover` + `safePolygon`, `useFocus`, `useClick`, `useDismiss`, `useRole`) | hover robusto e acessível |
| Estilo | CSS Modules + variáveis CSS (tokens), sem framework | zero configuração |
| Dados | `zod` (esquema), `gray-matter` (frontmatter), `image-size`, `tsx` (scripts TS) | esquema único para app e validador |
| Testes | Vitest + Testing Library + jsdom; Playwright (Chromium desktop + perfil móvel com toque) | unitário + ponta a ponta |
| Pipeline PDF | Python `.venv`: `pymupdf`, `pillow`, `numpy`, `sympy` (fallback de render: `pdftoppm`) | recorte por coordenadas, checagem numérica |
| Deploy | GitHub Pages (Actions) **ou** Netlify/Vercel (`npm run build` → `dist/`), **só com autorização do usuário** | gratuito |

## 0.5 Estrutura de pastas

```
Enade_simulador/
├─ *.pdf                          # 6 PDFs originais na raiz — nunca editar, mover ou renomear
├─ content/provas/<provaId>/
│  ├─ prova.json                  # metadados
│  ├─ gabarito.json               # gabarito oficial (fonte da verdade)
│  ├─ figuras.manifest.json       # recortes (bbox em pt)
│  ├─ textos-base/tb-35-37.json
│  ├─ questoes/q031.json · d01.json
│  └─ resolucoes/q031.md · d01.md
├─ public/figuras/<provaId>/q031-f1.webp · q050-alt-a.webp
├─ scripts/
│  ├─ pdf/        inventario.py · renderizar_paginas.py · candidatos_figuras.py · recortar.py
│  ├─ content/    schema.ts · validate.ts · build.ts · conferencia.ts
│  ├─ verificacao/<provaId>/q032.py   # checagens numéricas (SymPy/fractions)
│  └─ hooks/      validar-arquivo.mjs
├─ src/
│  ├─ app/        router.tsx · App.tsx · Layout.tsx
│  ├─ features/banco/      PaginaBanco.tsx · Filtros.tsx · ListaQuestoes.tsx · filtrar.ts
│  ├─ features/questao/    PaginaQuestao.tsx · Alternativas.tsx · NavegacaoQuestao.tsx · RascunhoDiscursiva.tsx
│  ├─ features/resolucao/  PaginaResolucao.tsx · CartaoGabarito.tsx · PopupQuestao.tsx
│  ├─ components/ Blocos.tsx · TextoRico.tsx · Markdown.tsx · Badge.tsx · ConteudoQuestao.tsx
│  ├─ data/       tipos.ts · carregar.ts · generated/ (gerado pelo build; não editar)
│  └─ styles/     tokens.css · global.css
├─ tests/e2e/*.spec.ts
├─ work/          # gitignored: paginas/ · paginas-grade/ · candidatos/ · inventario/ · conferencia/ · relatorios/
├─ docs/          ESPECIFICACAO.md · PADRAO-TRANSCRICAO.md · PADRAO-RESOLUCAO.md · PROGRESSO.md · REVISAO-HUMANA.md
└─ planos/
```

## 0.6 Modelo de dados (contrato)

Tipos TypeScript (em `src/data/tipos.ts`); o esquema `zod` equivalente fica em `scripts/content/schema.ts` (recursão de `quadro` via `z.lazy`) e o app usa os tipos inferidos.

```ts
export type ProvaId = '2021-licenciatura' | '2025-prova1' | '2025-prova5';
export type Letra = 'A' | 'B' | 'C' | 'D' | 'E';
export type Parte = 'formacao-geral' | 'componente-especifico';

/** Markdown inline (negrito/itálico) + LaTeX inline $...$. Sem HTML. Real = "R\$". */
export type TextoRico = string;

export type Bloco =
  | { tipo: 'titulo'; texto: TextoRico }                        // "TEXTO I"
  | { tipo: 'paragrafo'; texto: TextoRico }
  | { tipo: 'formula'; latex: string }                          // fórmula em destaque
  | { tipo: 'lista'; ordenada: boolean; itens: TextoRico[] }
  | { tipo: 'afirmativas'; itens: { rotulo: 'I' | 'II' | 'III' | 'IV' | 'V'; texto: TextoRico }[] }
  | { tipo: 'conectivo'; texto: 'PORQUE' }                      // asserção-razão
  | { tipo: 'tabela'; cabecalho?: TextoRico[]; linhas: TextoRico[][]; legenda?: TextoRico }
  | { tipo: 'imagem'; src: string; alt: string; legenda?: TextoRico; larguraMaxPx?: number }
  | { tipo: 'quadro'; blocos: Bloco[] }                         // conteúdo dentro de caixa
  | { tipo: 'fonte'; texto: TextoRico };                        // crédito, alinhado à direita

export interface Prova {
  id: ProvaId; ano: 2021 | 2025; ordem: number;
  titulo: string;                 // "ENADE 2025 · Matemática (Licenciatura) · Prova 1"
  subtitulo: string;              // "1ª aplicação · Caderno 1401 · Tipo 01"
  arquivoProva: string; arquivoGabarito: string;
  alternativasPorQuestao: 4 | 5;
  linhasDiscursiva: 15 | 30;
}

export interface TextoBase {
  id: string;                     // "tb-35-37"
  provaId: ProvaId;
  titulo: string;                 // "Texto para as questões 35 a 37"
  questoes: number[];             // [35, 36, 37]
  blocos: Bloco[];
}

export interface Questao {
  id: string;                     // "2025-prova1-q031" | "2021-licenciatura-d04"
  provaId: ProvaId;
  tipo: 'objetiva' | 'discursiva';
  numero: number;                 // objetivas: número oficial; discursivas: 1..5 (2021) ou 1 (2025)
  rotulo: string;                 // "Questão 31" | "Questão Discursiva 4"
  parte: Parte;
  ordemCaderno: number;           // posição no caderno (2021: D1, D2, 1–8, D3–D5, 9–35)
  paginas: number[];              // 1-based, PDF da prova
  textoBaseId?: string;
  enunciado: Bloco[];
  alternativas?: { letra: Letra; blocos: Bloco[] }[];            // obrigatório se objetiva
  itens?: { rotulo: string; texto: TextoRico; valor?: string }[]; // discursivas
  notaEditorial?: string;         // correção de diagramação registrada (ex.: ∈ → ε)
}
```

`gabarito.json`:
```json
{ "provaId": "2021-licenciatura", "fonte": "2021 - Matemática - Licenciatura - Gabarito.pdf",
  "objetivas": { "1": "E", "2": "C", "...": "..." , "35": "E" },
  "discursivas": ["D1", "D2", "D3", "D4", "D5"] }
```
(o `"...": "..."` acima é só abreviação deste documento; o arquivo real lista as 35 chaves)

`figuras.manifest.json` (coordenadas em pt no espaço do PyMuPDF, origem no canto superior esquerdo de `page.rect`):
```json
{ "provaId": "2025-prova1",
  "figuras": [
    { "arquivo": "q050-alt-a.webp", "pagina": 29, "bbox": [95.0, 480.5, 300.2, 610.0], "dpi": 220,
      "uso": { "questaoId": "2025-prova1-q050", "papel": "alternativa", "letra": "A" },
      "status": "aprovado" } ] }
```
`papel`: `enunciado | texto-base | alternativa`. `status`: `pendente | aprovado | revisao-humana`.

Resolução = Markdown com frontmatter (`resolucoes/q032.md`):
```md
---
questaoId: 2025-prova1-q032
respostaIndependente: D      # letra obtida ANTES de consultar o gabarito (objetivas)
respostaFinal: D             # tem de ser igual ao gabarito oficial
verificacao: aprovada        # pendente | aprovada | reprovada
revisaoHumana: false         # true se divergência com o gabarito ou ambiguidade que muda a resposta
checagemNumerica: scripts/verificacao/2025-prova1/q032.py   # quando houver cálculo
---
```

**Exemplo-padrão de questão** (`content/provas/2025-prova1/questoes/q032.json`):
```json
{
  "id": "2025-prova1-q032", "provaId": "2025-prova1", "tipo": "objetiva", "numero": 32,
  "rotulo": "Questão 32", "parte": "componente-especifico", "ordemCaderno": 33, "paginas": [20],
  "textoBaseId": "tb-31-32",
  "enunciado": [
    { "tipo": "paragrafo", "texto": "De acordo com os dados laboratoriais, com o tempo e o uso de agentes descontaminantes, a concentração de chumbo no solo decaía de forma proporcional à quantidade ainda presente, comportamento típico de processos de decaimento exponencial, dado pelo modelo $C(t) = C_0 \\cdot e^{-kt}$, em que:" },
    { "tipo": "lista", "ordenada": false, "itens": [
      "$C(t)$ representa a quantidade total de chumbo (mg) no tempo $t$ (ano);",
      "$C_0$ é a concentração inicial total de chumbo (mg);",
      "$k = 0{,}1$ é a taxa de decaimento." ] },
    { "tipo": "paragrafo", "texto": "Qual função $C(t)$ expressa corretamente a concentração de chumbo ao longo do tempo?" }
  ],
  "alternativas": [
    { "letra": "A", "blocos": [{ "tipo": "paragrafo", "texto": "$C(t) = (1{,}44 \\times 10^{7}) \\cdot e^{-0{,}1t}$" }] },
    { "letra": "B", "blocos": [{ "tipo": "paragrafo", "texto": "$C(t) = (7{,}2 \\times 10^{5}) \\cdot e^{-0{,}1t}$" }] },
    { "letra": "C", "blocos": [{ "tipo": "paragrafo", "texto": "$C(t) = (1{,}44 \\times 10^{6}) \\cdot e^{-0{,}1t}$" }] },
    { "letra": "D", "blocos": [{ "tipo": "paragrafo", "texto": "$C(t) = (7{,}2 \\times 10^{6}) \\cdot e^{-0{,}1t}$" }] }
  ]
}
```
(`ordemCaderno` 33 = 30 objetivas FG + discursiva + Q31 antes dela.)

## 0.7 Gabaritos de referência (dupla conferência)

Lidos visualmente no planejamento. Na Fase 1 o agente extrai de novo dos PDFs; o validador compara as duas leituras. **Qualquer diferença = parar e perguntar ao usuário.**

**2021-licenciatura (A–E)** — discursivas D1–D5 sem gabarito ("***")
- 01–08: `E C B B A A C D`
- 09–35: `E D E D B A B C A C D C B A A B E C A D C B D A C C E`

**2025-prova1 (Tipo 01, A–D)** — discursiva "***"
- 01–10: `D B C D C A B D D D` · 11–20: `A D C B A C A A C C`
- 21–30: `C C A C A D B B B A` · 31–40: `B D B D C D D A C A`
- 41–50: `C B B A C B A D D C` · 51–60: `A C A A C A C A D C`
- 61–70: `A A D D B B D D D B` · 71–80: `B A C B C A D B B C`

**2025-prova5 (Tipo 05, A–D)** — discursiva "***"
- 01–10: `A B D B C B D B B D` · 11–20: `D C A D B D B A A A`
- 21–30: `B D A B C C C A C B` · 31–40: `D A C A C B A C B A`
- 41–50: `B C B D B D A C A C` · 51–60: `B C D B A C D C D C`
- 61–70: `D A C D B A B C D B` · 71–80: `D B A B D B A D A D`

## 0.8 Mapa preliminar questão → página (confirmar na Fase 1)

Textos-base **não** estão todos listados: detectar na Fase 1 com a regex `Texto para (as )?questões`.

- **2021-licenciatura** — D1 p2 · D2 p4 · Q1 p5 · Q2 p6–7 · Q3 p8 · Q4 p9 · Q5 p10–11 · Q6 p11 · Q7 p12 · Q8 p13 · D3 p14 · D4 p15 · D5 p16 · Q9 p17 · Q10 p18 · Q11–12 p19 · Q13–14 p20 · Q15–16 p21 · Q17–18 p22 · Q19–20 p23 · Q21 p24 · Q22 p24–25 · Q23 p26 · Q24 p27 · Q25 p28 · Q26 p29 · Q27–28 p30 · Q29–30 p31 · Q31–32 p32 · Q33 p33 · Q34 p34 · Q35 p35. **FG** = D1, D2, Q1–Q8 · **CE** = D3–D5, Q9–Q35.
- **2025-prova1** — Q01–02 p2–3 · Q03–04 p4 · Q05–06 p5 · Q07–09 p6 · Q10–11 p7 · Q12–13 p8 · Q14–15 p9 · Q16–17 p10 · Q18–19 p11 · Q20–21 p12 · Q22–23 p13 · Q24–25 p14 · Q26–27 p15 · Q28 p16 · Q29–30 p17 · Discursiva p18 · Q31–32 p20 · Q33–34 p21 · Q35–37 p22 · Q38–39 p23 · Q40–42 p24 · Q43 p25 · Q44–45 p26 · Q46–47 p27 · Q48–49 p28 · Q50–51 p29 · Q52 p30 · Q53–54 p31 · Q55–56 p32 · Q57–58 p33–34 · Q59–61 p35 · Q62 p36 · Q63–64 p37 · Q65 p38 · Q66–67 p39 · Q68–69 p40 · Q70 p41 · Q71–72 p42 · Q73–74 p43 · Q75–76 p44 · Q77–78 p45 · Q79 p46 · Q80 p47. **FG** = Q01–30 + Discursiva · **CE** = Q31–80.
- **2025-prova5** — Q01 p2 · Q02–03 p3 · Q04 p4 · Q05–07 p5 · Q08–09 p6 · Q10–11 p7 · Q12–14 p8 · Q15–16 p9 · Q17–19 p10 · Q20–21 p11 · Q22 p12 · Q23–24 p13 · Q25–26 p14 · Q27–28 p15 · Q29 p16 · Q30 p17 · Discursiva p18 · Q31–32 p20 · Q33–34 p21 · Q35–36 p22 · Q37–38 p23 · Q39–41 p24 · Q42–43 p25 · Q44–45 p26 · Q46–47 p27 · Q48–49 p28 · Q50–51 p29 · Q52–53 p30 · Q54–55 p31 · Q56–57 p32 · Q58–59 p33 · Q60–61 p34 · Q62–63 p35 · Q64–65 p36 · Q66 p37 · Q67–69 p38 · Q70–71 p39 · Q72–73 p40 · Q74–75 p41 · Q76 p42 · Q77–78 p43 · Q79 p44 · Q80 p45. **FG** = Q01–30 + Discursiva · **CE** = Q31–80.

## 0.9 Telas e interação

**Rotas (hash):**

| Rota | Tela |
|---|---|
| `#/?ano=2025&prova=2025-prova1` | Banco de questões com filtros |
| `#/questao/:questaoId?ano=…&prova=…` | Questão |
| `#/questao/:questaoId/resolucao?marcada=B&ano=…&prova=…` | Resolução |
| `*` | "Página não encontrada" + link para o banco |

Marcação: contexto React em memória + `?marcada=` na URL da resolução (sobrevive a F5; nada em storage).

**Banco (`PaginaBanco`)**
- `<select>` Ano (Todos · 2021 · 2025) e `<select>` Prova (opções filtradas pelo ano + "Todas as provas"). Mudar o ano limpa a prova incompatível.
- "N questões encontradas". Lista agrupada por prova (2021 → 2025-P1 → 2025-P5), em `ordemCaderno`.
- Card: rótulo, badges, prévia (primeiro parágrafo, fórmulas renderizadas inline, cortado em ~140 caracteres).
- Função pura `filtrarQuestoes(indice, { ano, prova })` e `vizinhas(listaFiltrada, id)` com testes unitários.

**Questão (`PaginaQuestao`)**
- Breadcrumb `ENADE 2025 › Prova 1 › Questão 31` + badges.
- Texto-base em `<section>` com título ("Texto para as questões 31 e 32"), antes do enunciado.
- Figuras: `max-width: 100%` (ou `larguraMaxPx`); tabelas com rolagem horizontal própria.
- Alternativas: `role="radiogroup"`; cada item `role="radio"` + `aria-checked`; letra em círculo; setas navegam, Espaço/Enter marca; clicar na marcada desmarca.
- Ações: **Ver gabarito** (primário) ou **Ver resposta esperada**; "‹ Anterior" / "Próxima ›" (respeitam filtro); "Voltar ao banco".
- Discursiva: itens a), b), c) com valor; `<textarea>` "Rascunho (não é salvo)" com limite indicativo de linhas.

**Resolução (`PaginaResolucao`)**
- Título "Resolução · Questão 31" + botão **Ver questão** (fixo no topo ao rolar, em telas ≥ 768 px).
- `CartaoGabarito`: "Gabarito: **D**" + conteúdo **somente** da alternativa D. Se `marcada`: "Você marcou **B** — incorreta ✗" ou "— correta ✓".
- Corpo: Markdown renderizado com as seções do padrão (0.12).
- Rodapé: "Voltar à questão" (mantém a marcação) e "Próxima questão".
- Discursiva: sem cartão de letra; título "Resposta esperada".

**`PopupQuestao` (requisito crítico)**
- Gatilho: botão "Ver questão" com `aria-haspopup="dialog"` e `aria-expanded`.
- Ponteiro fino (mouse): abre após ~120 ms de hover; `safePolygon` mantém aberto ao mover para o pop-up; fecha ~200 ms após sair de ambos; abre com foco (Tab); fecha com Esc, blur ou clique fora.
- Toque (`(hover: none)`): toque abre/fecha; botão "Fechar" dentro do pop-up; toque fora fecha.
- Conteúdo: **mesmo** componente `ConteudoQuestao` da tela da questão (texto-base + enunciado + figuras + alternativas), sem marcação.
- Caixa: largura `min(720px, 92vw)`, `max-height: 70vh`, `overflow: auto`; `offset(8)`, `flip()`, `shift({ padding: 8 })`; `role="dialog"`, `aria-label="Enunciado da Questão 31"`; não aprisiona o foco.
- Transição de opacidade ~120 ms, desligada com `prefers-reduced-motion`.

**Visual:** tokens CSS (contraste AA), `system-ui` 17 px, altura de linha 1,6, largura de leitura ~72ch, modo escuro por `prefers-color-scheme`. Título do site: "Simulador ENADE · Matemática (Licenciatura)". Sem logotipos oficiais.

## 0.10 Pipeline de figuras (recorte)

**Recortar × transcrever**

| Conteúdo | Tratamento |
|---|---|
| Parágrafos, listas, afirmativas, fórmulas, matrizes, tabelas simples de texto/números, quadros de cálculo | **Transcrever** (texto + LaTeX / `tabela` / `quadro`) |
| Fotos, charges, mapas, gráficos, diagramas geométricos, infográficos, telas de software, tabelas com logotipos/cores essenciais, desenhos de estudantes, símbolos históricos (hieróglifos, cuneiformes) | **Recortar** (WebP) |
| Alternativa cujo conteúdo é figura | Um recorte por alternativa (`q050-alt-a.webp`), mapeado pela **letra impressa**, nunca pela posição |
| Rótulos internos da figura (eixos, legendas internas) | Dentro do recorte; legenda externa ("Figura 1 – …") vira `legenda` |
| Cabeçalho, rodapé, logotipos, código de barras, "Área livre", barra "QUESTÃO NN", marcas de corte | **Nunca** recortar |

**Etapas**
1. `renderizar_paginas.py <provaId>` → `work/paginas/<provaId>/p017.png` (110 DPI) e `work/paginas-grade/<provaId>/p017.png` (mesma imagem com grade de coordenadas em pt a cada 50 pt, rótulos nas margens).
2. `candidatos_figuras.py <provaId>` → caixas candidatas em `work/candidatos/<provaId>.json` + PNG com caixas numeradas:
   - raster: `page.get_image_info(xrefs=True)` → `bbox`; descartar área < 1.500 pt² e caixas nas faixas de cabeçalho/rodapé (calibrar por prova na Fase 1);
   - vetorial: `page.get_drawings()`; descartar traços finos (< 2 pt) que cruzam ≥ 60% da coluna (réguas de título, "Área livre"); unir caixas a ≤ 8 pt; descartar grupos < 2.000 pt²;
   - expandir cada grupo com spans de `page.get_text("dict")` que tocam a caixa (±6 pt) e têm fonte menor que o corpo (rótulos de eixo).
3. Agente de recorte revisa candidatos + página com grade, ajusta e grava `figuras.manifest.json`.
4. `recortar.py <provaId> [--paginas 17 18]` → WebP em `public/figuras/<provaId>/` e folha de contato `work/conferencia/figuras-<provaId>.html`.
5. Agente abre cada recorte (≤ 5 imagens por passo) e aprova: nada cortado; nenhum texto externo; legível a 100%. Até 3 iterações por figura; depois `status: "revisao-humana"`.
6. O `alt` descritivo é escrito na transcrição (Fase 4), incluindo os dados necessários para resolver (valores do gráfico, rótulos, medidas).

**Esqueleto de `scripts/pdf/recortar.py`**
```python
import argparse, json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image, ImageChops

RAIZ = Path(__file__).resolve().parents[2]

def aparar(img: Image.Image, limiar: int = 245, margem: int = 6) -> Image.Image:
    mascara = ImageChops.invert(img.convert("L").point(lambda p: 255 if p > limiar else 0))
    caixa = mascara.getbbox()
    if not caixa:
        return img
    x0, y0, x1, y1 = caixa
    return img.crop((max(0, x0 - margem), max(0, y0 - margem),
                     min(img.width, x1 + margem), min(img.height, y1 + margem)))

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("prova_id")
    ap.add_argument("--paginas", type=int, nargs="*")
    args = ap.parse_args()
    base = RAIZ / "content" / "provas" / args.prova_id
    prova = json.loads((base / "prova.json").read_text("utf-8"))
    manifesto = json.loads((base / "figuras.manifest.json").read_text("utf-8"))
    destino = RAIZ / "public" / "figuras" / args.prova_id
    destino.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(RAIZ / prova["arquivoProva"])
    for item in manifesto["figuras"]:
        if args.paginas and item["pagina"] not in args.paginas:
            continue
        pagina = doc[item["pagina"] - 1]
        pix = pagina.get_pixmap(clip=fitz.Rect(item["bbox"]), dpi=item.get("dpi", 220), alpha=False)
        img = aparar(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
        img.save(destino / item["arquivo"], "WEBP", quality=90, method=6)
        print(f"ok {item['arquivo']} {img.width}x{img.height}")

if __name__ == "__main__":
    main()
```

## 0.11 Padrão de transcrição

- Fidelidade literal (pontuação, **negrito**, *itálico*); não resumir nem "melhorar" o texto.
- Fórmulas em LaTeX compatível com KaTeX; decimal `{,}`; espaço de milhar dentro de fórmula `41\,000`; em texto corrido manter "41 000,00".
- **Símbolo do real sempre `R\$`** (um `$` solto quebra o parser de matemática).
- Não transcrever "QUESTÃO NN", "Área livre", "RASCUNHO", números de página.
- Afirmativas I, II, III → `afirmativas`; "PORQUE" → `conectivo`; créditos/referências → `fonte`; caixas → `quadro`.
- Correções de diagramação evidentes (∈ → ε) são permitidas, registradas em `notaEditorial` e em `work/relatorios/transcricao-<provaId>.md`.
- Texto ilegível: nunca inventar; registrar e pedir revisão humana.
- Conferência após cada lote: `npm run content:validate` + comparação visual da página original com a questão renderizada (`work/conferencia/<provaId>.html`, gerado por `scripts/content/conferencia.ts`, ou `npm run dev`).

## 0.12 Padrão das resoluções

**Público:** licenciandos(as) em Matemática em fim de curso. **Tom:** professor(a) experiente, pt-BR claro, cada passo justificado; proibido "é fácil ver que", "obviamente".

**Protocolo anti-erro (obrigatório nos dois planos)**
1. Resolver **sem** consultar o gabarito; registrar `respostaIndependente`.
2. Comparar com `gabarito.json`. Igual → escrever a resolução. Diferente → reler a página PNG, conferir a transcrição, arredondamentos e a leitura do enunciado. Se persistir: a resolução chega ao gabarito oficial explicando o raciocínio pretendido pela banca + seção **Observação** com a divergência; `revisaoHumana: true`; registrar em `work/relatorios/divergencias.md`. **Nunca alterar o gabarito oficial.**
3. Questões com cálculo: script em `scripts/verificacao/<provaId>/qNNN.py` (SymPy/`fractions`) que imprime os valores-chave e testa as alternativas.
4. Verificação independente por outro agente em contexto limpo: refaz as contas, confere cada análise de alternativa, a didática e o formato; grava `verificacao: aprovada|reprovada` e o motivo em `work/relatorios/verificacao-<provaId>.md`.
5. Citações legais/teóricas só com certeza (lei, ano, autor). Proibido inventar artigos, páginas ou autores; na dúvida, argumentar pelo texto da própria questão.

**Estrutura — objetiva**
```md
## Ideia-chave
(1–3 frases: o que a questão avalia e a estratégia)

## Resolução passo a passo
**Passo 1 — …** justificativa + cálculo em LaTeX
…
**Conclusão:** alternativa **X**.

## Análise das alternativas
- **A — incorreta.** erro específico (e, quando possível, de onde vem o valor ou argumento enganoso)
- **B — …**
- **X — correta.** 1 frase

## Conceitos envolvidos
- **Conceito:** definição curta / propriedade usada

## Dica de prova
(opcional, 1–2 frases)

## Observação
(somente se houver ambiguidade, erro de enunciado ou divergência)
```
- Itens "I, II, III": no passo a passo, julgar **cada afirmativa** (V/F + justificativa) e depois mapear para a alternativa.
- Asserção-razão: julgar I, julgar II e, se ambas verdadeiras, julgar se II justifica I.
- Questões pedagógicas do CE: explicar a teoria de Educação Matemática envolvida (Modelagem, Resolução de Problemas, Análise de Erros, Etnomatemática, Pensamento Algébrico, DUA, BNCC) **e** a Matemática subjacente.

**Estrutura — discursiva**
```md
## O que a questão pede
## Resposta esperada
(por item: elementos obrigatórios)
## Critérios de avaliação
(completa × parcial × insuficiente; "Não há padrão de resposta oficial nos arquivos; critérios elaborados para estudo.")
## Exemplo de resposta
(texto-modelo no limite: 2021 ≤ 15 linhas ≈ 150–180 palavras; 2025 ≤ 30 linhas ≈ 300–350 palavras, dissertativo-argumentativo, respeitando os Direitos Humanos)
## Conceitos e referências
```
2021 D4 (Análise): demonstração completa por ε–n₀ nos dois sentidos + contraexemplo (ex.: $x_n = (-1)^n$).

**Extensão-alvo:** objetiva de Matemática 250–700 palavras · objetiva de FG 180–450 · discursiva 400–900.

**Exemplo-padrão (gold) — `content/provas/2025-prova1/resolucoes/q032.md`** (conferido no planejamento)
```md
---
questaoId: 2025-prova1-q032
respostaIndependente: D
respostaFinal: D
verificacao: aprovada
revisaoHumana: false
checagemNumerica: scripts/verificacao/2025-prova1/q032.py
---

## Ideia-chave
$C_0$ é a quantidade inicial **total** de chumbo, em mg: concentração superficial ($120\ \text{mg/m}^2$) vezes a **área real** da região triangular, que exige o teorema de Pitágoras e a conversão pela escala.

## Resolução passo a passo
**Passo 1 — Cateto que falta (no desenho).** O triângulo $ABC$ é retângulo em $B$, com hipotenusa $AC = 25$ cm e cateto $AB = 20$ cm:
$$BC = \sqrt{25^2 - 20^2} = \sqrt{225} = 15\ \text{cm}.$$

**Passo 2 — Medidas reais.** A escala gráfica indica que 1 cm do desenho corresponde a 20 m:
$$AB = 20 \cdot 20 = 400\ \text{m}, \qquad BC = 15 \cdot 20 = 300\ \text{m}.$$

**Passo 3 — Área real.**
$$A = \frac{400 \cdot 300}{2} = 60\,000\ \text{m}^2.$$

**Passo 4 — Quantidade inicial.**
$$C_0 = 120\ \tfrac{\text{mg}}{\text{m}^2} \cdot 60\,000\ \text{m}^2 = 7\,200\,000\ \text{mg} = 7{,}2 \times 10^{6}\ \text{mg}.$$

**Passo 5 — Modelo.** Com $k = 0{,}1$: $C(t) = 7{,}2 \times 10^{6} \cdot e^{-0{,}1t}$.

**Conclusão:** alternativa **D**.

## Análise das alternativas
- **A — incorreta.** $1{,}44 \times 10^{7}$ é o dobro do correto: usa a área do retângulo ($400 \cdot 300 = 120\,000\ \text{m}^2$) sem dividir por 2.
- **B — incorreta.** $7{,}2 \times 10^{5}$ é o valor correto dividido por 10, compatível com erro de potência de dez.
- **C — incorreta.** $1{,}44 \times 10^{6}$ combina os dois erros: não divide por 2 e erra a potência de dez.
- **D — correta.** $C_0 = 7{,}2 \times 10^{6}$ mg e $k = 0{,}1$.

## Conceitos envolvidos
- **Teorema de Pitágoras:** $a^2 = b^2 + c^2$ no triângulo retângulo.
- **Escala:** comprimentos multiplicam pelo fator da escala; áreas, pelo quadrado dele.
- **Concentração superficial:** $\text{mg/m}^2 \times \text{m}^2 = \text{mg}$.
- **Decaimento exponencial:** $C(t) = C_0 e^{-kt}$, com $C(0) = C_0$.

## Dica de prova
Faça análise dimensional antes de marcar: $C_0$ precisa estar em mg, o que obriga a multiplicar concentração por área **real**.

## Observação
O texto-base fala em "escala 1 : 20", mas a escala gráfica da figura indica 1 cm = 20 m (1 : 2 000). Com 1 : 20 literal, $C_0 = 720$ mg, que não está entre as alternativas; a leitura pretendida é a da escala gráfica.
```

`scripts/verificacao/2025-prova1/q032.py`:
```python
from fractions import Fraction
from math import isqrt

bc_cm = isqrt(25**2 - 20**2)                 # 15
ab_m, bc_m = 20 * 20, bc_cm * 20             # 400, 300
area_m2 = Fraction(ab_m * bc_m, 2)           # 60000
c0_mg = 120 * area_m2                        # 7200000
alternativas = {"A": 1.44e7, "B": 7.2e5, "C": 1.44e6, "D": 7.2e6}
print(f"BC={bc_cm} cm | área={area_m2} m² | C0={c0_mg} mg")
print("coincidem:", [k for k, v in alternativas.items() if abs(v - float(c0_mg)) < 1e-9 * float(c0_mg)])
```

## 0.13 Validação, testes e critérios de aceite

**`npm run content:validate`** (`scripts/content/validate.ts`; flags `--prova <id>`, `--arquivo <caminho>`, `--release`):
1. Esquema zod de `prova.json`, `gabarito.json`, `textos-base/*`, `questoes/*`, `figuras.manifest.json`.
2. Contagens: 2021 = 35 objetivas + 5 discursivas; cada 2025 = 80 objetivas + 1 discursiva.
3. Objetivas com 5 (2021) ou 4 (2025) alternativas, letras em ordem.
4. `gabarito.json` idêntico às strings de referência da seção 0.7 (dupla leitura).
5. Cada `imagem.src` existe em `public/`, `alt` ≥ 15 caracteres; nenhuma figura órfã; `status` do manifesto ≠ `pendente`.
6. Todo LaTeX (questões e resoluções) compila com KaTeX `throwOnError: true`.
7. Proibidos: `TODO`, `TBD`, `PREENCHER`, `[incerto]`, `lorem`, `R$` sem barra, HTML cru.
8. `textoBaseId` existe e o texto-base lista a questão.
9. Resoluções (obrigatórias a partir da Fase 6): arquivo existe; `respostaFinal === gabarito`; seções obrigatórias presentes; na análise, uma entrada por alternativa; `--release` exige `verificacao: aprovada` em todas.

**`npm run content:build`** → `src/data/generated/indice.json` (metadados + prévias) e `src/data/generated/<provaId>.json` (questões + textos-base + gabarito + resoluções em string + dimensões das imagens via `image-size`).

**Testes unitários (Vitest):** `filtrarQuestoes`, `vizinhas`, renderização de `Blocos` (parágrafo com LaTeX gera `.katex`; imagem com `alt`; afirmativas), `CartaoGabarito` (mostra só a correta; mensagem de marcação), funções do validador (gabarito divergente falha; `R$` sem barra falha).

**E2E (Playwright, `tests/e2e/`):**
- `filtros.spec.ts` — ano 2025 limita as provas a P1/P5; prova 2025-prova1 lista 81 itens.
- `questao-resolucao.spec.ts` — abrir `2025-prova1-q032`, marcar B, "Ver gabarito" → URL termina em `/resolucao?marcada=B…`; mostra "Gabarito: D", "Você marcou B — incorreta" e nenhuma outra alternativa no cartão.
- `popup.spec.ts` — hover em "Ver questão" → diálogo visível com texto do enunciado; mover o mouse para dentro mantém aberto; sair fecha; Esc fecha; Tab abre.
- `toque.spec.ts` (projeto móvel com `hasTouch`) — toque abre/fecha; botão "Fechar" funciona.
- `discursiva.spec.ts` — `2021-licenciatura-d04` mostra "Ver resposta esperada" e o rascunho.
- `smoke-todas.spec.ts` — para as 202 questões: tela da questão e da resolução sem erro de console, sem `.katex-error`, todas as `<img>` com `naturalWidth > 0`.

**Definition of Done global**
- [ ] 202 questões (195 objetivas + 7 discursivas) validadas; gabaritos 100% iguais nas duas leituras.
- [ ] Todas as figuras `aprovado`; nenhuma órfã; nenhuma `revisao-humana` pendente.
- [ ] 202 resoluções `verificacao: aprovada`; todas as `revisaoHumana: true` revisadas pelo usuário.
- [ ] `npm test`, `npm run test:e2e`, `npm run build` e `npm run content:validate -- --release` passando.
- [ ] Lighthouse mobile: Acessibilidade ≥ 95, Desempenho ≥ 85.
- [ ] Revisão humana amostral: ≥ 20 questões (10%), estratificadas por prova e parte, PDF × app (`docs/REVISAO-HUMANA.md`).
- [ ] Publicação somente após autorização explícita.

## 0.14 Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Erro matemático na resolução | resolução cega + gabarito travado no validador + script numérico + verificador independente + amostragem humana |
| Transcrição infiel de fórmulas | leitura visual da página, KaTeX validado, conferência lado a lado |
| Recorte cortando rótulos ou pegando texto vizinho | candidatos automáticos + revisão visual + folha de contato |
| Alternativas-imagem trocadas | mapear pela letra impressa; checagem explícita na conferência |
| `R$` quebrando o parser de LaTeX | regra `R\$` + validador |
| Limite de imagens por contexto do agente | ≤ 5 imagens por passo; subagente novo por lote |
| Conflito entre agentes paralelos | um arquivo por questão; lotes disjuntos; manifesto editado só por entradas do lote |
| Aparência de site oficial / direitos | créditos INEP e fontes; sem logotipos; aviso "site não oficial" |
| Custo e tempo | lotes, paralelismo controlado, validador automático cedo (Fase 2) |
| `npm create vite` apagar arquivos da raiz | nunca criar o scaffold na raiz: gerar em `work/scaffold` e copiar |

## 0.15 Fases (iguais nos dois planos) e publicação

| Fase | Entrega | Depende de |
|---|---|---|
| 0 Fundação | git, ambiente Python/Node, scaffold, docs, configuração do agente | — |
| 1 Inventário | páginas PNG, texto auxiliar, mapa questão→página, textos-base, gabaritos JSON conferidos, candidatos de figuras | 0 |
| 2 Dados e validador (TDD) | `schema.ts`, `validate.ts`, `build.ts`, `conferencia.ts`, testes com fixtures | 0 |
| 3 Figuras | manifestos + WebPs aprovados | 1, 2 |
| 4 Transcrição | 202 questões + textos-base validados | 1, 2, 3 |
| 5 Aplicação web | telas, pop-up, testes unitários e E2E | 2 (pode correr em paralelo a 3–4) |
| 6 Resoluções | 202 resoluções verificadas | 4 |
| 7 QA e publicação | Definition of Done + deploy autorizado | 5, 6 |

Paralelismo seguro: 3 trilhas por prova. **Cada `figuras.manifest.json` é editado por um único agente de cada vez** (lotes sequenciais dentro da trilha da prova). Transcrições e resoluções podem ter vários agentes na mesma prova, desde que os lotes sejam disjuntos (um texto-base pertence ao lote de suas questões).

**Publicação (somente após autorização):** `vite.config.ts` com `base: './'`. GitHub Pages via `.github/workflows/deploy.yml` (usar as versões maiores mais recentes das actions):
```yaml
name: Deploy
on:
  push: { branches: [main] }
  workflow_dispatch: {}
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run content:validate -- --release
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```
Alternativa sem GitHub: Netlify ou Vercel importando o repositório (build `npm run build`, pasta `dist`).

---

# PARTE B — Plano para Google Antigravity + Gemini 3.8 Flash

## B.0 Modo de operação

- Abrir a pasta `Enade_simulador` no Antigravity (IDE ou Antigravity 2.0) como workspace. Modelo: **Gemini 3.8 Flash** em todas as conversas. Se houver seletor de nível de raciocínio: **High** nas Fases 1, 3, 4 e 6; **Medium** nas Fases 0, 2, 5 e 7.
- Modo **Planning** em todas as fases: o agente produz Task List e Implementation Plan (artefatos) → você comenta/aprova → execução → Walkthrough com evidências. Modo Fast só para correção pontual de 1 arquivo.
- **Conversas curtas:** uma conversa por fase; nas Fases 3, 4 e 6, uma conversa por trilha. Toda conversa começa com `@AGENTS.md @docs/PROGRESSO.md`.
- Progresso: Task List (artefato) durante a conversa + `docs/PROGRESSO.md` atualizado ao fim de cada lote (persistência entre conversas).
- Terminal: execução automática para comandos do projeto (`npm`, `npx`, `node`, `py`, `.venv\Scripts\python`, `git add`, `git commit`); confirmação para `git push`, instalações globais, exclusões fora de `work/` e qualquer publicação (reforçado por hook, B.2).
- Subagentes customizados em `.agents/agents/`, acionados pelo agente principal (`invoke_subagent`) em paralelo, sempre com lotes disjuntos; acompanhe no painel de subagentes / Agent Manager.
- Browser subagent nas Fases 5 e 7 para testar telas, com capturas e gravações como evidência.
- **Não usar Workflows** (depreciados, desligam em 01/11/2026): procedimentos repetíveis viram **Skills** em `.agents/skills/`.
- Cada arquivo de regras (`AGENTS.md`, `.agents/rules/*.md`) ≤ 12.000 caracteres.
- Mídia: abrir só as páginas PNG do lote, não o PDF inteiro — mesmo com 1M de tokens de contexto, foco no detalhe vale mais.

## B.1 Adaptações ao Gemini 3.8 Flash (o que muda em relação ao Plano A)

| Risco típico em tarefas longas | Contramedida neste plano |
|---|---|
| Deriva de formato em saídas estruturadas | exemplo rotulado q032; um JSON por questão; hook de validação a cada gravação; "Concluído quando" com comando obrigatório |
| Erro em cadeias longas de cálculo | lotes de **3** questões; script SymPy **obrigatório** sempre que houver conta; verificador independente |
| Ajustar a resolução para "bater" com o gabarito | etapa cega **separada**: `resolvedor-cego` grava só letra + raciocínio curto em `work/cego/`, com leitura do gabarito bloqueada por hook enquanto existir `work/cego/BLOQUEIO` |
| Citações e legislação inventadas | regra "citar só com certeza"; verificador reprova citação duvidosa |
| Omitir partes ("…", "idem às anteriores") | validador exige todas as seções e uma análise por alternativa; placeholders proibidos |
| Reescrever arquivos grandes inteiros | um arquivo por questão; editar só arquivos do lote |
| Leitura imprecisa de figuras | auditoria cruzada da transcrição (outro subagente compara com o PNG) |
| Perda de contexto entre conversas | `AGENTS.md` + regras por glob + `docs/PROGRESSO.md` |
| Declarar pronto sem testar | Walkthrough só é aceito com a saída dos comandos colada |

Diferenças operacionais em números: lotes de transcrição ≤ 3 questões (A: 4–6); lotes de resolução = 3 (A: 5); até 3 subagentes paralelos (A: 5); etapa cega em subagente separado com bloqueio do gabarito (A: na mesma execução do resolvedor); auditoria cruzada de transcrição em 100% das questões com fórmula ou figura (A: 1 questão sorteada por lote).

## B.2 Configuração do agente (criada na Fase 0)

### `AGENTS.md` (raiz)
```md
# Simulador ENADE Matemática — instruções para agentes

## Produto
Webapp estático (Vite + React + TypeScript) com as 202 questões do ENADE Matemática Licenciatura (2021, 2025-prova1, 2025-prova5) e resoluções comentadas. Fonte da verdade: docs/ESPECIFICACAO.md. Plano: planos/PLANO-B-ANTIGRAVITY-GEMINI-3.8-FLASH.md.

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
```

### Regras em `.agents/rules/` (modo de ativação definido no painel de Rules/Customizations)

| Arquivo | Ativação | Conteúdo |
|---|---|---|
| `00-inviolaveis.md` | Always On | as 9 regras do `AGENTS.md` + protocolo "Parar e perguntar" |
| `10-conteudo.md` | Glob `content/**/questoes/**`, `content/**/textos-base/**` | seções 0.6 e 0.11 da especificação, exemplo q032 e a regra `R\$` |
| `20-resolucoes.md` | Glob `content/**/resolucoes/**`, `scripts/verificacao/**` | seção 0.12 completa (protocolo, estruturas, extensão, exemplo gold) |
| `30-figuras.md` | Glob `scripts/pdf/**`, `content/**/figuras.manifest.json`, `public/figuras/**` | seção 0.10 (tabela recortar × transcrever, etapas, critérios de aprovação) |
| `40-app.md` | Glob `src/**`, `tests/**` | seções 0.3, 0.4, 0.9 e 0.13 (telas, pop-up, a11y, testes) |

Se algum arquivo passar de 12.000 caracteres, dividir (ex.: `20a-resolucoes-protocolo.md` e `20b-resolucoes-exemplo.md`).

### Skills em `.agents/skills/<nome>/SKILL.md`

**`resolver-questao/SKILL.md`**
```md
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
```

**`verificar-resolucao/SKILL.md`**
```md
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
```

**`recortar-figuras/SKILL.md`** — frontmatter `name: recortar-figuras` + descrição "Recorta figuras de um lote de páginas das provas do ENADE e mantém figuras.manifest.json. Use na Fase 3". Passos: (1) ler seção 0.10; (2) para cada página do lote abrir `work/candidatos/<provaId>/pNNN.png` e `work/paginas-grade/<provaId>/pNNN.png` (≤ 5 imagens por passo); (3) decidir recortar × transcrever; em alternativas-imagem, identificar a **letra impressa** (grade 2×2 costuma ser A, C em cima e B, D embaixo); (4) gravar só as entradas das páginas do lote no manifesto (bbox em pt; nomes `qNNN-f1.webp`, `qNNN-alt-a.webp`, `tb-XX-YY-f1.webp`); (5) rodar `.venv\Scripts\python scripts/pdf/recortar.py <provaId> --paginas <lista>`; (6) abrir cada WebP e aprovar só se nenhum rótulo/eixo/legenda interna estiver cortado e nenhum texto de enunciado, alternativa, cabeçalho ou "Área livre" estiver incluído; (7) no máximo 3 iterações por figura, depois `status: "revisao-humana"`. "Concluído quando: todas as figuras do lote com status `aprovado` ou `revisao-humana` e tabela arquivo | página | uso | status | observação emitida".

**`transcrever-questao/SKILL.md`** — passos: (1) ler seção 0.11 e q032.json; (2) abrir página PNG e `work/inventario/<provaId>/pNNN.txt` (a imagem manda); (3) escrever JSON por questão e texto-base; (4) checklist por tipo — alternativas na ordem e contagem correta, alternativas-imagem pela letra impressa, afirmativas/PORQUE como blocos próprios, tabelas completas, `fonte` presente, `R\$`, `alt` com dados; (5) `npm run content:validate -- --arquivo`; (6) comparar palavra por palavra. "Concluído quando: validador sem erros e lista questão | arquivo | figuras | notas".

**`conferir-ui/SKILL.md`** — roteiro para o browser subagent: `npm run build && npm run preview`; abrir `#/`; filtrar Ano 2025 → Prova 1; abrir `2025-prova1-q032`; marcar B; "Ver gabarito"; conferir "Gabarito: D" e "Você marcou B — incorreta"; passar o mouse em "Ver questão", mover para dentro do pop-up e rolar; sair e confirmar fechamento; Esc; repetir em viewport 390 × 844 com toque; abrir `2021-licenciatura-d04`; capturar tela de cada estado como artefato. "Concluído quando: todas as capturas anexadas e nenhum desvio da seção 0.9".

### Subagentes em `.agents/agents/`

**`resolvedor-cego.md`**
```md
---
name: resolvedor-cego
description: Resolve questões do ENADE sem acesso ao gabarito e registra apenas a letra escolhida e um raciocínio curto. Use na etapa cega da Fase 6, antes de escrever as resoluções.
model: inherit
tools:
  - view_file
  - list_dir
  - write_to_file
  - run_command
commandExecutionPolicy: auto
subagent: true
mainAgent: false
---
# Papel
Doutor(a) em Matemática e em Educação, especialista em ENADE.

# Tarefa
Para cada questaoId recebido: leia content/provas/<provaId>/questoes/<arquivo>.json e a página PNG em work/paginas/<provaId>/. Resolva com cuidado (use .venv\Scripts\python para contas). Grave work/cego/<provaId>/<arquivo>.json:
{ "questaoId": "...", "resposta": "A|B|C|D|E|discursiva", "confianca": "alta|media|baixa", "raciocinio": "até 120 palavras" }

# Proibido
Abrir gabarito.json ou qualquer arquivo em resolucoes/. Gravar fora de work/cego/.
```

**`resolvedor-matematica.md`**
```md
---
name: resolvedor-matematica
description: Doutor(a) em Matemática e formador(a) de professores que escreve resoluções rigorosas e didáticas do Componente Específico do ENADE, em lotes de 3 questões, usando a skill resolver-questao.
model: inherit
tools:
  - view_file
  - list_dir
  - grep_search
  - write_to_file
  - replace_file_content
  - run_command
commandExecutionPolicy: auto
subagent: true
mainAgent: false
skills:
  - resolver-questao
---
# Papel
Doutor(a) em Matemática com 20 anos formando professores. Domina Cálculo, Análise Real, Álgebra Linear, Álgebra, Teoria dos Números, Geometrias, Probabilidade e Estatística, Equações Diferenciais, Matemática Financeira, História da Matemática e Educação Matemática (Modelagem, Resolução de Problemas, Investigação, Análise de Erros, Etnomatemática, Pensamento Algébrico, Tecnologias, DUA, BNCC). Seu texto ensina a resolver aquele TIPO de questão.

# Tarefa
Aplique a skill resolver-questao a cada questaoId do lote, uma questão por vez, até o validador passar.

# Mensagem final
Tabela: questaoId | resposta cega | gabarito | script numérico | revisaoHumana.
```

**`resolvedor-formacao-geral.md`** — mesmo frontmatter (nome/descrição próprios, `skills: [resolver-questao]`), papel: doutor(a) em Educação especialista em políticas públicas, legislação educacional (CF/1988, LDB, ECA, BNCC, diretrizes curriculares, educação inclusiva, EJA, educação do campo, indígena e quilombola, Libras), didática, currículo, avaliação, direitos humanos, atualidades e redação dissertativo-argumentativa; regras extras: argumentar pelos textos da questão, citar só com certeza, explicar a armadilha de cada distrator.

**`verificador.md`** — frontmatter com `tools: [view_file, list_dir, grep_search, replace_file_content, write_to_file, run_command]`, `skills: [verificar-resolucao]`; papel: professor(a) titular e parecerista adversarial ("seu trabalho é encontrar erros"); também executa **auditoria cruzada de transcrição** na Fase 4 (compara JSON × PNG e lista divergências, sem editar a questão).

**`transcritor.md`** — frontmatter análogo (`tools: [view_file, list_dir, grep_search, write_to_file, replace_file_content, run_command]`, `skills: [transcrever-questao]`); papel: revisor(a) editorial de provas de Matemática, fluente em LaTeX e obcecado(a) por fidelidade literal; nunca resume, nunca "melhora" o texto, nunca inventa trecho ilegível (registra em `work/relatorios/transcricao-<provaId>.md` e para); mensagem final: questão | arquivo | figuras usadas | notas editoriais | pendências.

**`recortador-figuras.md`** — frontmatter análogo (mesmas ferramentas, `skills: [recortar-figuras]`); papel: especialista em processamento de PDF e revisão visual de figuras de provas; nunca edita PDFs, nunca altera entradas de páginas fora do lote, nunca recorta texto que deve ser transcrito; mensagem final: arquivo | página | uso | status | observação.

(Opcional, fora da premissa "só Flash": `model: pro` apenas no `verificador` aumenta o rigor da auditoria.)

### Hooks — `.agents/hooks.json`
```json
{
  "validar-conteudo": {
    "enabled": true,
    "PostToolUse": [
      {
        "matcher": "write_to_file|replace_file_content|multi_replace_file_content",
        "hooks": [ { "type": "command", "command": "node scripts/hooks/antigravity-validar.mjs", "timeout": 90 } ]
      }
    ]
  },
  "proteger-acoes": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "run_command|view_file",
        "hooks": [ { "type": "command", "command": "node scripts/hooks/antigravity-proteger.mjs", "timeout": 10 } ]
      }
    ]
  }
}
```

`scripts/hooks/antigravity-proteger.mjs` (lê o payload inteiro como texto, independente do nome dos campos):
```js
import { existsSync } from 'node:fs';

let entrada = '';
process.stdin.on('data', (parte) => (entrada += parte));
process.stdin.on('end', () => {
  const texto = entrada.toLowerCase();
  let saida = { decision: 'allow' };
  if (/git\s+push|gh\s+repo\s+create|netlify\s+deploy|vercel\s+(deploy|--prod)/.test(texto)) {
    saida = { decision: 'ask', reason: 'Push/publicação exige autorização do usuário.' };
  } else if (texto.includes('gabarito.json') && existsSync('work/cego/BLOQUEIO')) {
    saida = { decision: 'deny', reason: 'Etapa cega em andamento: gabarito indisponível.' };
  }
  process.stdout.write(JSON.stringify(saida));
});
```

`scripts/hooks/antigravity-validar.mjs`: extrai do payload (regex) caminhos `content[\\/]…\.(json|md)`, roda `npx tsx scripts/content/validate.ts --arquivo <caminho>` para cada um, imprime os erros e sai com código ≠ 0 em falha; sai 0 se `scripts/content/validate.ts` ainda não existir.

> Na Fase 0, testar os dois hooks com uma gravação inválida proposital e um `git push --dry-run`. Se a versão instalada do Antigravity não repassar a saída do PostToolUse ao agente, manter a regra 7 do `AGENTS.md` (validação manual obrigatória ao fim de cada arquivo/lote) — o bloqueio do gabarito (PreToolUse) continua valendo.

## B.3 Fases de execução (Antigravity)

> Em todas as fases: nova conversa em **Planning**, colar o prompt, revisar Task List e Implementation Plan, aprovar, acompanhar os ✅ e só aceitar o Walkthrough com as saídas dos comandos. Checkpoints humanos marcados com 🛑.

### Fase 0 — Fundação · raciocínio Medium

**Passos**
- [ ] Hashes SHA-256 dos PDFs em `docs/PROGRESSO.md` (`Get-FileHash *.pdf`).
- [ ] `git init` + `.gitignore` (`node_modules/ dist/ .venv/ work/ src/data/generated/ playwright-report/ test-results/`).
- [ ] `py -m venv .venv` → `.venv\Scripts\python -m pip install pymupdf pillow numpy sympy` → `pip freeze > requirements.txt`.
- [ ] Scaffold: `npm create vite@latest work/scaffold -- --template react-ts` e copiar `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html`, `src/`, `public/` para a raiz (**nunca** rodar o create na raiz).
- [ ] Dependências: `npm i react-router katex react-markdown remark-math rehype-katex remark-gfm @floating-ui/react` e `npm i -D zod gray-matter image-size tsx vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test @axe-core/playwright` → `npx playwright install chromium`.
- [ ] `vite.config.ts` com `base: './'` e bloco `test` (jsdom, `setupFiles`); `index.html` com `lang="pt-BR"`.
- [ ] Scripts npm: `dev` (`npm run content:build && vite`), `build` (`npm run content:build && tsc -b && vite build`), `preview`, `test` (`vitest run`), `test:e2e` (`playwright test`), `content:build` (`tsx scripts/content/build.ts`, versão mínima que gera índice vazio), `content:validate` (`tsx scripts/content/validate.ts`).
- [ ] `AGENTS.md`, `.agents/rules/*`, `.agents/skills/*`, `.agents/agents/*`, `.agents/hooks.json`, `scripts/hooks/*` conforme B.2.
- [ ] `docs/ESPECIFICACAO.md` (= Parte 0), `docs/PROGRESSO.md`, `docs/REVISAO-HUMANA.md`.
- [ ] Conferir no painel de Customizations que regras, skills e agentes aparecem; testar os hooks.

**Prompt**
```text
@planos/PLANO-B-ANTIGRAVITY-GEMINI-3.8-FLASH.md
Objetivo: executar SOMENTE a Fase 0 do Plano B.
Estado inicial: raiz com 6 PDFs e a pasta planos/. Sem git. Python 3.14 (py), Node 24 e Poppler (MiKTeX) instalados. Sem PyMuPDF/Pillow.
Estado-alvo: git iniciado; .venv com pymupdf, pillow, numpy, sympy; app Vite React TS na raiz com as dependências e os scripts npm listados nos Passos da Fase 0; AGENTS.md, .agents/rules, .agents/skills, .agents/agents, .agents/hooks.json e scripts/hooks conforme a seção B.2; docs/ESPECIFICACAO.md = Parte 0 inteira; docs/PROGRESSO.md; docs/REVISAO-HUMANA.md.
Ações permitidas: criar arquivos; rodar npm, npx, node, py, .venv\Scripts\python, git add, git commit.
Ações proibidas: rodar "npm create vite" na raiz (gere em work/scaffold e copie); mover, renomear ou editar os PDFs; git push; instalar pacotes globais; apagar arquivos fora de work/.
Parar e perguntar: comando falhando 2 vezes; qualquer necessidade de sobrescrever arquivo existente.
Pontos de verificação: escreva "✅ <passo>" após cada passo.
Concluído quando: npm run dev abre o app; npm test executa; .venv\Scripts\python -c "import fitz, PIL, numpy, sympy" sem erro; hashes dos PDFs iguais aos iniciais; hook de validação reage a um JSON inválido proposital em content/ (depois apagado) e "git push --dry-run" pede confirmação; commit "chore: fundação"; Walkthrough com todas as saídas.
```

### Fase 1 — Inventário das provas e gabaritos · raciocínio High

**Passos**
- [ ] `inventario.py`, `renderizar_paginas.py`, `candidatos_figuras.py`; `prova.json` ×3; `scripts/pdf/calibracao.json`.
- [ ] `gabarito.json` ×3 (2025-prova1 por leitura visual a 150 DPI) + tabela comparativa com a seção 0.7. 🛑 Qualquer diferença.
- [ ] Mapa: 3 subagentes `self` em paralelo (um por prova), cada um confirmando a seção 0.8 com ≤ 5 PNGs por passo → `docs/MAPA-QUESTOES.md`.

**Prompt**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/ESPECIFICACAO.md
Objetivo: executar SOMENTE a Fase 1 do Plano B.
Estado inicial: Fase 0 concluída; nenhum arquivo em content/.
Estado-alvo: scripts/pdf/inventario.py, renderizar_paginas.py e candidatos_figuras.py funcionando para as 3 provas; work/inventario, work/paginas, work/paginas-grade e work/candidatos gerados; content/provas/<id>/prova.json e gabarito.json das 3 provas; scripts/pdf/calibracao.json; docs/MAPA-QUESTOES.md com as 202 questões (questão | páginas | coluna | parte | texto-base | figuras raster | suspeita de figura vetorial).
Método: implemente e rode os scripts; extraia os gabaritos (2025-prova1 por leitura visual da página renderizada); mostre tabela gabarito extraído × seção 0.7; depois invoque 3 subagentes self em paralelo, um por prova, para confirmar visualmente o mapa (máximo 5 PNGs por passo) e listar os textos-base (regex "Texto para (as )?questões").
Ações proibidas: editar PDFs; escrever questões; alterar as strings da seção 0.7.
Parar e perguntar: qualquer divergência de gabarito; total diferente de 202 (35+5, 80+1, 80+1).
Concluído quando: as contagens batem, os 3 gabaritos coincidem 100% com a seção 0.7, docs/MAPA-QUESTOES.md está completo, commit feito e o Walkthrough traz a tabela comparativa.
```

### Fase 2 — Esquema, validador e build (TDD) · raciocínio Medium

**Passos**
- [ ] Fixtures q032 em `scripts/content/__fixtures__/`.
- [ ] Testes que falham primeiro (lista do prompt abaixo) → implementar `schema.ts`, `validate.ts`, `build.ts`, `conferencia.ts`, `gabaritos-referencia.ts`.
- [ ] Regra extra do Plano B no validador: se existir `work/cego/<provaId>/<arquivo>.json`, `respostaIndependente` da resolução deve ser igual à resposta cega.

**Prompt**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/ESPECIFICACAO.md
Objetivo: executar SOMENTE a Fase 2 do Plano B com TDD.
Estado-alvo: scripts/content/schema.ts, validate.ts (flags --prova, --arquivo, --release), build.ts, conferencia.ts e gabaritos-referencia.ts; fixtures em scripts/content/__fixtures__ com o exemplo q032 (questão, texto-base mínimo, gabarito, resolução gold, imagem WebP de teste).
Método obrigatório, nesta ordem: (1) escreva estes testes: aceita q032; rejeita objetiva com 3 alternativas; rejeita "R$" sem barra; rejeita LaTeX inválido; rejeita gabarito diferente da seção 0.7; rejeita imagem inexistente ou alt curto; rejeita resolução sem "## Análise das alternativas"; rejeita respostaFinal diferente do gabarito; rejeita respostaIndependente diferente de work/cego quando o arquivo cego existir; --release rejeita verificacao pendente; build gera índice e JSON por prova; conferencia gera HTML. (2) rode e cole a saída mostrando as falhas. (3) implemente. (4) rode e cole a saída verde.
Ações proibidas: criar arquivos em content/provas/*/questoes ou resolucoes; relaxar testes para passar.
Concluído quando: npm test verde com todos os testes acima; npm run content:validate passa sobre content/ atual; commit; Walkthrough com as duas saídas (vermelha e verde).
```

### Fase 3 — Recorte de figuras · raciocínio High

**Passos**
- [ ] `recortar.py` com `--paginas` e folha de contato.
- [ ] Piloto com subagente `recortador-figuras`: 2025-prova1 p.20, 24, 29, 46. 🛑 Você aprova a folha de contato.
- [ ] 3 trilhas paralelas (uma por prova); dentro da trilha, lotes sequenciais de ≤ 4 páginas por subagente novo.
- [ ] Após cada lote: `npm run content:validate -- --prova <id>` + `docs/PROGRESSO.md`.
- [ ] Fechamento: lista de `revisao-humana` 🛑; regerar tudo e confirmar idempotência.

**Prompt**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/MAPA-QUESTOES.md
Objetivo: executar SOMENTE a Fase 3 do Plano B usando a skill recortar-figuras.
Estado inicial: Fases 0–2 concluídas; candidatos em work/candidatos.
Estado-alvo: scripts/pdf/recortar.py com --paginas e folha de contato work/conferencia/figuras-<provaId>.html; figuras.manifest.json das 3 provas com todas as figuras em status aprovado ou revisao-humana; WebPs em public/figuras/<provaId>/.
Método: (1) implemente recortar.py; (2) piloto: invoque 1 subagente recortador-figuras para 2025-prova1 páginas 20, 24, 29 e 46; gere a folha de contato e PARE para aprovação; (3) após aprovação, 3 trilhas paralelas (uma por prova), cada trilha com lotes sequenciais de até 4 páginas, um subagente novo por lote; nunca dois subagentes no mesmo manifesto.
Ações proibidas: recortar texto que deve ser transcrito; editar entradas de páginas fora do lote; editar PDFs.
Parar e perguntar: mais de 10% das figuras de um lote em revisao-humana; alternativa-imagem sem letra identificável.
Pontos de verificação: "✅ lote <prova> <páginas>" com a tabela do subagente.
Concluído quando: todas as páginas com figura cobertas; nenhum status pendente; recortar.py <provaId> regenera sem diferença; folhas de contato anexadas ao Walkthrough; commit por prova.
```

### Fase 4 — Transcrição das 202 questões · raciocínio High

**Passos**
- [ ] Piloto: subagente `transcritor` com 2025-prova1 Q31, Q32 e `tb-31-32` (deve reproduzir o exemplo-padrão q032) + auditoria do `verificador` + `work/conferencia/2025-prova1.html`. 🛑 Você aprova.
- [ ] Lotes de ≤ 3 questões (agrupadas por página/texto-base); ≤ 3 subagentes em paralelo; ordem 2025-prova1 → 2025-prova5 → 2021.
- [ ] Após cada lote: validação; **auditoria cruzada** pelo `verificador` (100% das questões com fórmula, tabela ou figura; demais, 1 por lote) comparando JSON renderizado × PNG; o `transcritor` corrige as divergências apontadas.
- [ ] Atenção explícita no prompt dos lotes: alternativas-imagem (P1 Q50, Q79), matrizes (P1 Q37, P5 Q66), afirmativas e asserção-razão (2021), Análise (2021 D4), tabelas (P5 Q44, Q72–73), quadro de cálculo (P5 texto 37–38), poema (P5 texto 20–21).
- [ ] Fechamento por prova: `npm run content:build`, conferência completa, commit. 🛑 Você revisa ≥ 10 questões na conferência.

**Prompt (uma conversa por prova)**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/MAPA-QUESTOES.md
Objetivo: executar a Fase 4 do Plano B para a prova <provaId>, usando as skills transcrever-questao (transcritor) e verificar-resolucao só na parte de auditoria de transcrição (verificador).
Estado inicial: figuras da prova aprovadas; validador pronto.
Estado-alvo: todas as questões e textos-base da prova em content/provas/<provaId>/ validados e auditados.
Método: (1) [somente na 2025-prova1] piloto Q31, Q32 e tb-31-32; gere a conferência e PARE para aprovação; (2) lotes de até 3 questões agrupadas por página/texto-base, até 3 subagentes transcritor em paralelo; (3) após cada lote, rode npm run content:validate -- --prova <provaId>, invoque o verificador para auditar 100% das questões com fórmula, tabela ou figura (e 1 das demais) comparando com o PNG; devolva divergências ao transcritor; (4) atualize docs/PROGRESSO.md.
Ações proibidas: resumir ou reescrever enunciados; inventar trecho ilegível; editar arquivos fora do lote; usar "R$" sem barra.
Parar e perguntar: texto ilegível; validação falhando 2 vezes no mesmo arquivo; alternativa-imagem com letra duvidosa.
Pontos de verificação: "✅ lote <questões> — auditoria: X divergências corrigidas".
Concluído quando: npm run content:validate -- --prova <provaId> sem erros com a contagem correta (35+5 ou 80+1); conferência regenerada e anexada; commit.
```

### Fase 5 — Aplicação web · raciocínio Medium (pode rodar em paralelo às Fases 3–4, em outra conversa)

**Passos**
- [ ] Tokens visuais em `src/styles/tokens.css` (paleta AA claro/escuro, tipografia, espaçamentos) com estilo sóbrio e acadêmico.
- [ ] `carregar.ts`, `filtrar.ts` (+ testes), `TextoRico`, `Blocos`, `Markdown`, `ConteudoQuestao` (+ testes).
- [ ] Telas e componentes da seção 0.5/0.9, incluindo `PopupQuestao` com Floating UI (`useHover` com `delay { open: 120, close: 200 }` e `safePolygon()`, `useFocus`, `useClick` só em `(hover: none)`, `useDismiss`, `useRole('dialog')`).
- [ ] `router.tsx` (`createHashRouter`), `Layout` (pular para o conteúdo, rodapé com créditos/aviso), 404.
- [ ] Playwright (`desktop` Chromium + `mobile` Pixel 7 com toque; `webServer` = build + preview) com os specs da seção 0.13 + `@axe-core/playwright`.
- [ ] Browser subagent com a skill `conferir-ui`: capturas em 360, 768 e 1280 px, pop-up aberto e gravação do hover. 🛑 Você aprova o visual.

**Prompt**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/ESPECIFICACAO.md
Objetivo: executar SOMENTE a Fase 5 do Plano B (aplicação web).
Estado inicial: validador e build de conteúdo prontos; conteúdo parcial ou apenas fixtures.
Estado-alvo: telas Banco, Questão e Resolução conforme a seção 0.9; PopupQuestao exatamente como especificado; testes Vitest e Playwright (desktop e mobile) verdes; capturas de tela como artefatos.
Método: TDD para filtrar.ts, vizinhas, Blocos, CartaoGabarito e PopupQuestao (escreva o teste, veja falhar, implemente, veja passar); depois telas e rotas; depois E2E; por fim invoque o browser subagent com a skill conferir-ui.
Ações proibidas: alterar content/, scripts/ ou o modelo de dados; adicionar bibliotecas fora da seção 0.4 (exceto @axe-core/playwright); salvar marcação em localStorage.
Parar e perguntar: se o modelo de dados precisar mudar; se o hover não puder ser estável com Floating UI.
Pontos de verificação: "✅ <componente/tela> + testes".
Concluído quando: npm test, npm run build e npm run test:e2e verdes (cole as saídas); axe sem violações sérias; capturas e gravação do pop-up anexadas; commit.
```

### Fase 6 — Resoluções comentadas · raciocínio High

**Pipeline por lote de 3 questões**
1. Criar `work/cego/BLOQUEIO`.
2. Até 3 subagentes `resolvedor-cego` em paralelo (um lote cada).
3. Apagar `work/cego/BLOQUEIO`; rodar `npx tsx scripts/content/comparar-cego.ts --prova <id>` (tabela resposta cega × gabarito → `work/relatorios/cego-<provaId>.md`).
4. Até 3 subagentes `resolvedor-matematica` ou `resolvedor-formacao-geral` em paralelo (skill `resolver-questao`).
5. `npm run content:validate -- --prova <id>`.
6. Subagente `verificador` em contexto novo (skill `verificar-resolucao`) para o lote.
7. Reprovadas → de volta ao resolvedor com o relatório (máx. 2 ciclos) → persistindo, `revisaoHumana: true`.

> O `work/cego/BLOQUEIO` vale para o workspace inteiro: **não** rodar duas conversas da Fase 6 ao mesmo tempo. O paralelismo acontece dentro da conversa (até 3 lotes simultâneos, todos na mesma janela de bloqueio).

**Trilhas (uma conversa por trilha, uma de cada vez)**

| Trilha | Questões | Resolvedor | Lotes de 3 |
|---|---|---|---|
| 1 | 2025-prova1 Q31–80 | `resolvedor-matematica` | 17 |
| 2 | 2025-prova5 Q31–80 | `resolvedor-matematica` | 17 |
| 3 | 2021 Q9–35 + D3–D5 | `resolvedor-matematica` | 10 |
| 4 | 2021 Q1–8; 2025-P1 Q1–30; 2025-P5 Q1–30 | `resolvedor-formacao-geral` | 23 |
| 5 | Discursivas FG (2021 D1–D2; 2025-P1; 2025-P5) | `resolvedor-formacao-geral` | 2 |

**Passos**
- [ ] Criar `scripts/content/comparar-cego.ts` (+ teste).
- [ ] Copiar a resolução gold da seção 0.12 para `content/provas/2025-prova1/resolucoes/q032.md` e o script `q032.py`; validar.
- [ ] Piloto na trilha 1: lote Q31, Q33, Q34. 🛑 Você lê as 3 resoluções e aprova o nível didático.
- [ ] Executar trilhas 1 → 5; relatórios `verificacao-<provaId>.md`, `cego-<provaId>.md` e `divergencias.md` atualizados; commit ao fim de cada trilha.
- [ ] 🛑 Apresentar todos os casos `revisaoHumana: true` com resumo (candidatos prováveis: P5 Q50 e P5 Q68; P1 Q31–32 devem trazer Observação sobre a escala).

**Prompt (por trilha)**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/ESPECIFICACAO.md @content/provas/2025-prova1/resolucoes/q032.md
Objetivo: executar a Fase 6 do Plano B, TRILHA <N> (questões: <lista>).
Estado inicial: questões da trilha transcritas e validadas; skills resolver-questao e verificar-resolucao e subagentes resolvedor-cego, <resolvedor-matematica|resolvedor-formacao-geral> e verificador disponíveis.
Estado-alvo: uma resolução por questão da trilha em content/provas/<provaId>/resolucoes/, com respostaIndependente vinda da etapa cega, respostaFinal igual ao gabarito, verificacao aprovada ou revisaoHumana: true justificada; relatórios atualizados.
Método por lote de 3 questões, com até 3 lotes em paralelo: (1) crie work/cego/BLOQUEIO; (2) invoque resolvedor-cego; (3) apague o BLOQUEIO e rode comparar-cego.ts; (4) invoque o resolvedor; (5) rode npm run content:validate -- --prova <provaId>; (6) invoque o verificador em contexto novo; (7) reprovadas voltam ao resolvedor com o relatório, no máximo 2 ciclos; depois revisaoHumana: true.
[Somente trilha 1] Faça primeiro o lote piloto Q31, Q33, Q34 e PARE para minha aprovação.
Ações proibidas: alterar gabarito.json; resolvedor-cego ler gabarito ou resoluções; resoluções sem script numérico quando houver conta; citações incertas; editar questões.
Parar e perguntar: 2 ou mais divergências cegas no mesmo lote; verificador reprovando o mesmo arquivo 3 vezes.
Pontos de verificação: "✅ lote <ids> — cego X/3 igual ao gabarito — verificação Y/3 aprovadas".
Concluído quando: todas as questões da trilha com resolução validada; npm run content:validate -- --prova <provaId> sem erros; relatórios anexados ao Walkthrough; commit.
```

### Fase 7 — QA final, revisão humana e publicação · raciocínio Medium

**Passos**
- [ ] `npm run content:validate -- --release`, `npm test`, `npm run build`, `npm run test:e2e` (com `smoke-todas.spec.ts` nas 202 questões).
- [ ] Browser subagent: Lighthouse mobile (ou `npx lighthouse` sobre o preview) → Acessibilidade ≥ 95, Desempenho ≥ 85; corrigir.
- [ ] `docs/REVISAO-HUMANA.md` com ≥ 20 questões estratificadas. 🛑 Você revisa; o agente corrige.
- [ ] `README.md` (rodar, atualizar conteúdo, créditos, aviso de site não oficial).
- [ ] 🛑 Perguntar a plataforma de publicação; só então repositório remoto + `.github/workflows/deploy.yml` (seção 0.15) ou Netlify/Vercel.
- [ ] Browser subagent na URL publicada: filtros, questão, resolução, pop-up (desktop e 390 × 844 com toque).

**Prompt**
```text
@AGENTS.md @docs/PROGRESSO.md @docs/ESPECIFICACAO.md
Objetivo: executar SOMENTE a Fase 7 do Plano B.
Estado inicial: Fases 0–6 concluídas.
Estado-alvo: Definition of Done da seção 0.13 integralmente cumprida; docs/REVISAO-HUMANA.md gerado; README.md; site publicado somente após minha autorização e testado pelo browser subagent.
Método: rode npm run content:validate -- --release, npm test, npm run build e npm run test:e2e (incluindo smoke nas 202 questões) e corrija falhas; auditoria Lighthouse mobile; gere docs/REVISAO-HUMANA.md com 20+ questões estratificadas e PARE para minha revisão; depois pergunte a plataforma de publicação.
Ações proibidas: git push, criar repositório remoto ou publicar sem minha confirmação explícita; desativar testes.
Concluído quando: todas as caixas da Definition of Done marcadas com evidência; URL pública testada com capturas anexadas; tag v1.0.0.
```

---

# Verificação ponta a ponta (ambos os planos)

1. `npm run content:validate -- --release` → 0 erros; resumo "202 questões · 202 resoluções aprovadas · N figuras".
2. `npm test` → verde. `npm run build` → sem erros de tipo. `npm run test:e2e` → desktop + mobile verdes, incluindo smoke das 202 questões.
3. `npm run preview` → no navegador: Ano 2025 → Prova 5 → Questão 66 (matrizes) → marcar A → "Ver gabarito" → "Gabarito: A", "Você marcou A — correta" → passar o mouse em "Ver questão", entrar no pop-up, rolar, sair (fecha) → Tab até o botão (abre) → Esc (fecha).
4. Mesmo fluxo no celular (ou DevTools 390 × 844 com toque): toque abre/fecha; botão "Fechar".
5. Conferência visual: `work/conferencia/<provaId>.html` para 2021 Q11 (elipse vetorial), 2025-prova1 Q50 (alternativas-imagem) e 2021 D4 (fórmulas).
6. `docs/REVISAO-HUMANA.md` preenchido pelo usuário, sem pendências.
7. Hashes SHA-256 dos 6 PDFs iguais aos registrados na Fase 0.

