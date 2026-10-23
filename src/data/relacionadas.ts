import type { ResumoQuestao } from './tipos';

/**
 * Questões relacionadas (RF14): as que compartilham o assunto principal da questão, ordenadas pelo
 * número de assuntos em comum e, no empate, priorizando outras provas e a ordem do índice.
 */
export function questoesRelacionadas(questoes: ResumoQuestao[], questaoId: string, limite = 5): ResumoQuestao[] {
  const atual = questoes.find((q) => q.id === questaoId);
  const principal = atual?.assuntos?.[0];
  if (!atual || !principal) return [];
  const doAtual = new Set(atual.assuntos);
  return questoes
    .filter((q) => q.id !== questaoId && q.assuntos?.includes(principal))
    .map((q, ordem) => ({
      q,
      ordem,
      comuns: (q.assuntos ?? []).filter((a) => doAtual.has(a)).length,
      outraProva: q.provaId !== atual.provaId ? 1 : 0,
    }))
    .sort((a, b) => b.comuns - a.comuns || b.outraProva - a.outraProva || a.ordem - b.ordem)
    .slice(0, limite)
    .map((x) => x.q);
}
