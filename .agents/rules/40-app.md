# Regras para Aplicação Web e Testes

**Glos de Aplicação:** `src/**`, `tests/**`

## Requisitos do App
1. **100% estático:** roteamento por hash (`createHashRouter`) sem dependência de servidor ou rewrites.
2. **Zero persistência:** marcação do usuário mantida apenas em memória / parâmetro de URL (`?marcada=`), sem uso de `localStorage` ou cookies.
3. **Pop-up de visualização da questão (`PopupQuestao`):**
   - Implementado com `@floating-ui/react`.
   - Hover em mouse com delay suave (120ms para abrir, 200ms para fechar) e `safePolygon` para transição mouse -> pop-up sem fechar.
   - Suporte a teclado (Tab foca e abre, Esc fecha) e acessibilidade WCAG 2.2 AA (`role="dialog"`, `aria-haspopup="dialog"`, `aria-expanded`).
   - Suporte a telas de toque: toque alterna estado, botão interno de fechar presente.
4. **Matemática com KaTeX:** renderização estrita com zero erros `.katex-error` em produção.
5. **Acessibilidade:** contraste em modo claro e escuro, labels descritivos em imagens (`alt`), elementos com semântica apropriada (ex.: alternativas com `role="radiogroup"` e `role="radio"`).
6. **Identidade visual UFMS** (`docs/DESIGN-UFMS.md`):
   - Cores só por tokens de `src/styles/tokens.css` (`--cor-*`; primitivos `--ufms-*`). `#0088B7` não é cor de texto (4,0:1): texto/botões usam `--cor-primaria`.
   - Assinatura UFMS apenas pelos WebP de `public/marca/` (gerados por `scripts/marca/converter_logo.py`): nunca distorcer, recolorir ou recortar; sem mascote Capi, sem slogan, sem marcas INEP/ENADE.
   - Sem emoji como ícone (usar `lucide-react` com `aria-hidden`), sem glassmorphism, sem gradiente roxo, sem card com borda só na lateral.
   - Fontes Poppins/Inter/JetBrains Mono via `@fontsource` (`src/styles/fontes.ts`); nada de CDN.
   - Animações só com `transform` (opacidade parcial reduz contraste medido pelo axe) e zeradas por `prefers-reduced-motion`; alvos de toque ≥ 44 px.
