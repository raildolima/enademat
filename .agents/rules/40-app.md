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
