import { describe, it, expect } from 'vitest';
import { executarComparacaoCega, salvarRelatorioCego } from '../../scripts/content/comparar-cego';

describe('comparar-cego.ts', () => {
  it('compara respostas cegas contra o gabarito oficial de 2025-prova1', () => {
    const res = executarComparacaoCega('2025-prova1');
    expect(res.total).toBeGreaterThanOrEqual(1);
    expect(res.iguais).toBeGreaterThanOrEqual(1);

    const q032 = res.questoes.find((q) => q.questaoId === '2025-prova1-q032');
    expect(q032).toBeDefined();
    expect(q032?.respostaCega).toBe('D');
    expect(q032?.gabarito).toBe('D');
    expect(q032?.coincide).toBe(true);

    const relPath = salvarRelatorioCego(res);
    expect(relPath).toContain('cego-2025-prova1.md');
  });
});
