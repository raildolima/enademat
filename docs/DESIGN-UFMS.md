# Identidade visual — Design System UFMS

Registro da aplicação do Design System da UFMS ao frontend (2026-09-26). Fonte da paleta, tipografia, raios, sombras e regras de marca: pasta de referência `UFMS - Design/` (não versionada; `colors_and_type.css`, `reference/01-DESIGN_SYSTEM_UFMS.md`, `GETTING_STARTED.html` §10–14).

## Decisões

| Tema | Decisão |
|---|---|
| Marca | Assinatura horizontal da UFMS no cabeçalho (positiva; negativa no tema escuro) e no rodapé (negativa). Sem mascote Capi (uso reservado à Agecom), sem slogan, sem marcas INEP/ENADE (RNF06). O rodapé mantém "Site não oficial" (RF09). |
| Fontes | Poppins (títulos, 600/700/800), Inter (texto, 400/400 itálico/500/600/700), JetBrains Mono (badges e rótulos, 500). Empacotadas por `@fontsource/*` (subconjunto latin), importadas em `src/styles/fontes.ts`. Nenhuma requisição a CDN. |
| Ícones | `lucide-react` (padrão do kit UFMS), sempre `aria-hidden`. Nenhum emoji ou glifo (📐 👁️ ✓ ✗ ‹ › ←) como ícone. |
| Escopo | Redesenho visual e microinterações; nenhuma funcionalidade nova. |
| Tokens | `src/styles/tokens.css`: primitivos `--ufms-*` (paleta oficial) e tokens semânticos `--cor-*` com os mesmos nomes de antes, para os módulos não mudarem de API. |

## Paleta e contraste (medido, WCAG 2.2)

O azul UFMS puro `#0088B7` dá 4,03:1 com branco: reprovado para texto normal. Ele só aparece em elementos decorativos (`--cor-primaria-decorativa`: sublinhados de seção, faixa dos cards, anel de foco). Texto e botões usam `#006A8F`.

| Par (texto / fundo) | Uso | Razão |
|---|---|---|
| `#1A1A1A` / `#F5F7F9` | texto principal / fundo claro | 16,21 |
| `#4A5568` / `#FFFFFF` | texto secundário | 7,53 |
| `#616E7C` / `#FFFFFF` | texto atenuado | 5,21 |
| `#006A8F` / `#FFFFFF` | primária (links, botões), e branco sobre ela | 6,07 |
| `#0A7038` / `#D1F1E0` | sucesso | 5,13 |
| `#0F5230` / `#D1F1E0` | texto de sucesso | 7,65 |
| `#811919` / `#FBD9D9` | texto de erro | 7,68 |
| `#7A3D00` / `#FFE6CC` | texto de aviso | 6,99 |
| `#1A1A1A` / `#FFCD00` | texto sobre amarelo UFMS | 11,59 |
| `#FFFFFF` / `#002233` | faixas (rodapé, cabeçalho do pop-up) | 16,45 |
| `#E6F4F9` / `#005273` | subtítulo do hero (pior ponto do gradiente) | 7,61 |
| `#7B8794` / `#FFFFFF` | borda de campos (não texto, mínimo 3:1) | 3,66 |
| `#F5F7F9` / `#0B2A3C` | escuro: texto principal / superfície | 13,86 |
| `#C4CDD5` / `#0B2A3C` | escuro: texto secundário | 9,24 |
| `#9AA5B1` / `#0B2A3C` | escuro: texto atenuado | 5,95 |
| `#66BDDB` / `#0B2A3C` | escuro: primária | 6,99 |
| `#002233` / `#66BDDB` | escuro: texto sobre botão primário | 7,73 |
| `#8FE3B9` / `#08331F` | escuro: texto de sucesso | 9,22 |
| `#FFB3AD` / `#3D0F0F` | escuro: texto de erro | 9,66 |
| `#FFD3A3` / `#3A2200` | escuro: texto de aviso | 10,72 |
| `#6B8A9D` / `#0B2A3C` | escuro: borda de campos (não texto) | 4,07 |

A verificação automática fica em `tests/e2e/acessibilidade.spec.ts`: axe (WCAG 2.2 AA) nas 4 telas, nos temas claro e escuro.

## Forma e movimento

- Raios UFMS: 4 (inputs, badges), 8 (botões), 16 (cards, modal), 24 (painéis de destaque).
- Sombras tingidas de azul (`rgba(0,136,183,…)`); no escuro, sombras pretas.
- Durações UFMS de 150/250/400 ms, sem bounce. Todas as durações vão a 0 com `prefers-reduced-motion`, e as animações de feedback e o shimmer do esqueleto também são desligados.
- As animações de entrada dos cards usam só `transform`. Opacidade parcial reduziria o contraste medido pelo axe.
- Alvos de toque de pelo menos 44 px (`--alvo-toque`).

## Elementos por tela

- **Casca:**
  - Cabeçalho branco (escuro no tema escuro) com assinatura UFMS, divisor e o título do simulador junto a um ícone Σ em quadrado amarelo, sobre um filete com o gradiente institucional.
  - Rodapé na faixa `#002233`.
  - Skip-link amarelo.
- **Banco:**
  - Hero com gradiente profundo UFMS, grade de pontos decorativa e pílulas-resumo.
  - Filtros em painel elevado sobre o fim do hero.
  - Cards com faixa superior na cor da prova: 2021 azul, Prova 1 amarelo, Prova 5 verde. A cor é redundante com o título do grupo.
  - Hover com elevação e seta; entrada escalonada.
  - Esqueleto com shimmer durante o carregamento.
- **Questão:**
  - Texto-base em cartão azul-claro com título de seção sublinhado.
  - Alternativas como cartões grandes; a marcada ganha anel e check animado.
  - "Ver gabarito" com "soft press".
  - Barra de progresso ao lado de "Questão X de Y". O texto continua sendo a informação acessível; a barra é `aria-hidden`.
- **Resolução:**
  - Letra do gabarito em círculo amarelo.
  - Feedback de acerto com "pop" e de erro com tremida curta.
  - Seções do Markdown com sublinhado azul de 4 px.
  - Pop-up com cabeçalho na faixa escura e botão "Fechar" amarelo. Largura, altura e fade de ~120 ms seguem a especificação.

## Skill ui-ux-pro-max

Instalada com `npx ui-ux-pro-max-cli init --ai claude`, que criou `.claude/skills/` com ui-ux-pro-max e as skills auxiliares do pacote. A consulta foi:

```
search.py "educational quiz exam practice university students young institutional blue" --design-system --motion 5 --variance 4 --density 4
```

Ela recomendou claymorphism, paleta roxa e Fredoka/Nunito. Roxo e a troca de fontes foram descartados porque conflitam com o manual da UFMS (sem gradiente roxo, tipografia institucional). Foram aproveitados:

- formas arredondadas de 16–24 px;
- "soft press" de 150–250 ms;
- entrada escalonada (só com CSS, sem GSAP);
- o checklist de entrega:
  - sem emoji como ícone;
  - cursor de ponteiro nos clicáveis;
  - hover de 150–300 ms;
  - contraste ≥ 4,5:1;
  - foco visível;
  - `prefers-reduced-motion` respeitado;
  - responsivo em 375, 768, 1024 e 1440 px.

## Assets

- `public/marca/ufms-assinatura-horizontal-{positivo,negativo}.webp`: gerados por `scripts/marca/converter_logo.py` a partir de `UFMS - Design/assets/logos/`, com 120 px de altura, proporção original e cerca de 14 KB cada.
- Peso das fontes no build: cerca de 167 KB em woff2 (9 arquivos), baixados sob demanda.
