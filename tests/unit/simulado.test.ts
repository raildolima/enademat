import { describe, it, expect } from 'vitest';
import type { Gabarito, Parte, Questao } from '../../src/data/tipos';
import {
  codificarRespostas,
  corrigirSimulado,
  decodificarRespostas,
  formatarDuracao,
  questoesDoSimulado,
} from '../../src/data/simulado';

function questao(numero: number, parte: Parte, tipo: 'objetiva' | 'discursiva' = 'objetiva', ordem = numero): Questao {
  return {
    id: `2026-prova1-q${String(numero).padStart(3, '0')}`,
    provaId: '2026-prova1',
    tipo,
    numero,
    rotulo: `Questão ${numero}`,
    parte,
    ordemCaderno: ordem,
    paginas: [1],
    enunciado: [],
    alternativas: tipo === 'objetiva' ? (['A', 'B', 'C', 'D'] as const).map((letra) => ({ letra, blocos: [] })) : undefined,
  };
}

const questoes = [
  questao(1, 'formacao-geral'),
  questao(2, 'formacao-geral'),
  questao(1, 'formacao-geral', 'discursiva', 3),
  questao(31, 'componente-especifico', 'objetiva', 4),
];
const gabarito: Gabarito = {
  provaId: '2026-prova1',
  fonte: 'gabarito.pdf',
  objetivas: { '1': 'A', '2': 'D', '31': 'B' },
  discursivas: ['D1'],
};

describe('RF15 — simulado', () => {
  it('usa só as objetivas, na ordem do caderno', () => {
    expect(questoesDoSimulado(questoes).map((q) => q.numero)).toEqual([1, 2, 31]);
  });

  it('codifica e decodifica as respostas da URL, descartando letras inválidas', () => {
    const objetivas = questoesDoSimulado(questoes);
    expect(codificarRespostas(['A', null, 'B'])).toBe('A-B');
    expect(decodificarRespostas('a-b', objetivas)).toEqual(['A', null, 'B']);
    expect(decodificarRespostas('EZ', objetivas)).toEqual([null, null, null]);
    expect(decodificarRespostas(null, objetivas)).toEqual([null, null, null]);
  });

  it('corrige por parte e lista erradas e em branco para revisão', () => {
    const objetivas = questoesDoSimulado(questoes);
    const r = corrigirSimulado(objetivas, ['A', null, 'C'], gabarito);
    expect(r.total).toBe(3);
    expect(r.acertos).toBe(1);
    expect(r.porParte).toEqual([
      { parte: 'formacao-geral', total: 2, acertos: 1, erros: 0, emBranco: 1 },
      { parte: 'componente-especifico', total: 1, acertos: 0, erros: 1, emBranco: 0 },
    ]);
    expect(r.revisar.map((x) => [x.questao.numero, x.marcada, x.correta])).toEqual([
      [2, null, 'D'],
      [31, 'C', 'B'],
    ]);
  });

  it('ignora as questões anuladas na correção', () => {
    const objetivas = questoesDoSimulado(questoes);
    const r = corrigirSimulado(objetivas, ['A', null, 'C'], gabarito, new Set([2, 31]));
    expect(r.total).toBe(1);
    expect(r.acertos).toBe(1);
    expect(r.revisar).toEqual([]);
  });

  it('formata a duração do cronômetro', () => {
    expect(formatarDuracao(65)).toBe('01min05s');
    expect(formatarDuracao(3909)).toBe('1h05min09s');
  });
});
