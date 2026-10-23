import type { ProvaCompleta, Questao } from './tipos';

/** Corpo da resolução sem o frontmatter YAML. */
export function extrairCorpoMarkdown(conteudo: string): string {
  if (conteudo.startsWith('---')) {
    const fimFrontmatter = conteudo.indexOf('\n---', 3);
    if (fimFrontmatter !== -1) {
      return conteudo.slice(fimFrontmatter + 4).trim();
    }
  }
  return conteudo;
}

/** Texto de uma seção `## <titulo>` do Markdown, até a próxima seção de mesmo nível (sem o título). */
export function extrairSecao(markdown: string, titulo: string): string | null {
  const linhas = markdown.split('\n');
  const inicio = linhas.findIndex((l) => l.trim() === `## ${titulo}`);
  if (inicio === -1) return null;
  const fimRelativo = linhas.slice(inicio + 1).findIndex((l) => /^##\s/.test(l));
  const fim = fimRelativo === -1 ? linhas.length : inicio + 1 + fimRelativo;
  const secao = linhas.slice(inicio + 1, fim).join('\n').trim();
  return secao || null;
}

/** Markdown bruto (com frontmatter) da resolução da questão, se existir. */
export function resolucaoDaQuestao(prova: ProvaCompleta, questao: Questao): string | null {
  const idCurto =
    questao.tipo === 'discursiva'
      ? `d${String(questao.numero).padStart(2, '0')}`
      : `q${String(questao.numero).padStart(3, '0')}`;
  return prova.resolucoes[questao.id] || prova.resolucoes[idCurto] || null;
}
