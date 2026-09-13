# Regras Invioláveis do Projeto

## Regras Absolutas
1. **O gabarito oficial (content/provas/*/gabarito.json) NUNCA muda.** Divergência: registrar na seção `## Observação` da resolução + `revisaoHumana: true` + registrar em `work/relatorios/divergencias.md`.
2. **Um arquivo por questão e por resolução.** NUNCA editar arquivos fora do lote atual.
3. **Figuras SOMENTE via figuras.manifest.json + scripts/pdf/recortar.py.** Os PDFs originais na raiz NUNCA são editados, movidos ou renomeados.
4. **Conteúdo rigorosamente em pt-BR.** LaTeX compatível com KaTeX. Separador decimal com vírgula entre chaves: `{,}`. Símbolo do real sempre `R\$`.
5. **NUNCA executar git push, criar repositório remoto ou publicar sem autorização explícita do usuário.**
6. **No máximo 5 imagens por passo.** Usar PNG da página renderizada, nunca o PDF inteiro no contexto.
7. **"Concluído" SOMENTE com a saída dos comandos de validação e testes colada no Walkthrough.**
8. **Fazer apenas o que a fase pede.** NUNCA adicionar funcionalidades fora da especificação.
9. **NUNCA usar placeholders** ("...", "TODO", "TBD", "idem", "resto igual") em arquivos de conteúdo.

## Protocolo "Parar e Perguntar ao Usuário"
Pare imediatamente a execução e solicite confirmação nos seguintes casos:
- Gabarito divergente em 2 ou mais questões do lote;
- Erro em comando ou validação que persiste após 2 tentativas de correção;
- Qualquer exclusão ou modificação de arquivos fora da pasta `work/`;
- Qualquer publicação externa (GitHub, Netlify, Vercel).
