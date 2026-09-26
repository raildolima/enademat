---
name: conferir-ui
description: Roteiro de verificação ponta a ponta da interface web no navegador, incluindo filtros, pop-up em hover e toque, e telas de questão e resolução. Use nas Fases 5 e 7.
---
# Conferir UI

## Passos
1. Execute `npm run build && npm run preview`.
2. Acesse `#/` e teste os filtros: selecionar Ano 2025 e Prova 1.
3. Abra a questão `2025-prova1-q032`.
4. Marque a alternativa B e clique em "Ver gabarito".
5. Na tela de resolução, verifique se exibe "Gabarito: D" (somente o conteúdo de D) e o aviso "Você marcou B — incorreta".
6. Passe o cursor sobre o botão "Ver questão", aguarde o pop-up abrir, mova o ponteiro para o interior do pop-up e role o conteúdo. Afaste o mouse e confirme o fechamento. Teste também o fechamento com tecla Esc.
7. Alterne para viewport mobile (390 x 844 px) e teste o comportamento com toque e botão Fechar.
8. Abra a questão discursiva `2021-licenciatura-d04` e teste "Ver resposta esperada" e o campo de rascunho.
9. Capture telas de cada estado verificado. As capturas automatizadas (em `work/conferencia/ui/`) são geradas só sob demanda: `CONFERIR_UI=1 npx playwright test conferir-ui --project=desktop-chromium`.

## Concluído quando
Todas as capturas estiverem anexadas como evidência e nenhum desvio visual ou de acessibilidade tiver sido encontrado.
