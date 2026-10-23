import { describe, it, expect } from 'vitest';
import { filtrarQuestoes } from '../../src/data/filtrar';
import { questoesRelacionadas } from '../../src/data/relacionadas';
import { ASSUNTOS, rotuloAssunto } from '../../src/data/assuntos';
import type { IndiceProvas, ResumoQuestao } from '../../src/data/tipos';
import indiceReal from '../../src/data/generated/indice.json';

const indice = indiceReal as unknown as IndiceProvas;

function resumo(id: string, provaId: ResumoQuestao['provaId'], assuntos: string[]): ResumoQuestao {
  return { id, provaId, tipo: 'objetiva', numero: 1, rotulo: id, parte: 'componente-especifico', ordemCaderno: 1, previa: '', assuntos };
}

describe('RF14 — assuntos', () => {
  it('todas as 283 questões têm de 1 a 3 assuntos do vocabulário', () => {
    const ids = new Set<string>(ASSUNTOS.map((a) => a.id));
    expect(indice.questoes).toHaveLength(283);
    for (const q of indice.questoes) {
      expect(q.assuntos?.length, q.id).toBeGreaterThanOrEqual(1);
      expect(q.assuntos?.length, q.id).toBeLessThanOrEqual(3);
      expect(q.assuntos?.every((a) => ids.has(a)), q.id).toBe(true);
    }
  });

  it('filtra por assunto', () => {
    const res = filtrarQuestoes(indice, { assunto: 'estatistica' });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((q) => q.assuntos?.includes('estatistica'))).toBe(true);
    expect(filtrarQuestoes(indice, { assunto: 'todos' })).toHaveLength(283);
  });

  it('relacionadas compartilham o assunto principal, priorizando mais assuntos em comum e outras provas', () => {
    const lista = [
      resumo('a', '2026-prova1', ['geometria', 'tecnologias-ensino']),
      resumo('b', '2026-prova1', ['geometria']),
      resumo('c', '2021-licenciatura', ['geometria']),
      resumo('d', '2025-prova1', ['geometria', 'tecnologias-ensino']),
      resumo('e', '2025-prova1', ['estatistica', 'geometria']),
      resumo('f', '2025-prova1', ['estatistica']),
    ];
    expect(questoesRelacionadas(lista, 'a').map((q) => q.id)).toEqual(['d', 'c', 'e', 'b']);
    expect(questoesRelacionadas(lista, 'inexistente')).toEqual([]);
  });

  it('rótulo legível para cada id', () => {
    expect(rotuloAssunto('algebra-linear')).toBe('Álgebra Linear e Matrizes');
  });
});
