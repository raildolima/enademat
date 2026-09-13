import { describe, it, expect } from 'vitest';
import { filtrarQuestoes, vizinhas } from '../../src/data/filtrar';
import { IndiceProvas, ResumoQuestao } from '../../src/data/tipos';
import indiceReal from '../../src/data/generated/indice.json';

describe('filtrarQuestoes e vizinhas', () => {
  const indice = indiceReal as unknown as IndiceProvas;

  it('retorna todas as 202 questões quando nenhum filtro é passado', () => {
    const res = filtrarQuestoes(indice);
    expect(res.length).toBe(202);
  });

  it('filtra por ano 2021 (40 questões)', () => {
    const res = filtrarQuestoes(indice, { ano: 2021 });
    expect(res.length).toBe(40);
    expect(res.every((q) => q.provaId === '2021-licenciatura')).toBe(true);
  });

  it('filtra por ano 2025 (162 questões)', () => {
    const res = filtrarQuestoes(indice, { ano: 2025 });
    expect(res.length).toBe(162);
    expect(res.every((q) => q.provaId.startsWith('2025'))).toBe(true);
  });

  it('filtra por prova específica (2025-prova1: 81 questões)', () => {
    const res = filtrarQuestoes(indice, { provaId: '2025-prova1' });
    expect(res.length).toBe(81);
    expect(res.every((q) => q.provaId === '2025-prova1')).toBe(true);
  });

  it('filtra por tipo discursiva (7 questões no total)', () => {
    const res = filtrarQuestoes(indice, { tipo: 'discursiva' });
    expect(res.length).toBe(7);
    expect(res.every((q) => q.tipo === 'discursiva')).toBe(true);
  });

  it('filtra por parte componente-especifico', () => {
    const res = filtrarQuestoes(indice, { parte: 'componente-especifico' });
    // 2021: 30 questões (D03-D05 + Q09-Q35); 2025-P1: 50 questões (Q31-Q80); 2025-P5: 50 questões (Q31-Q80) = 130
    expect(res.length).toBe(130);
    expect(res.every((q) => q.parte === 'componente-especifico')).toBe(true);
  });

  it('filtra por termo de busca', () => {
    const res = filtrarQuestoes(indice, { termo: 'chumbo' });
    expect(res.length).toBeGreaterThanOrEqual(1);
    expect(res.some((q) => q.id === '2025-prova1-q032')).toBe(true);
  });

  it('calcula vizinhas corretamente no início, meio e fim', () => {
    const lista = filtrarQuestoes(indice, { provaId: '2025-prova1' });
    expect(lista.length).toBe(81);

    // Primeiro elemento
    const prim = vizinhas(lista, lista[0].id);
    expect(prim.posicaoAtual).toBe(1);
    expect(prim.anterior).toBeNull();
    expect(prim.proxima).not.toBeNull();
    expect(prim.proxima?.id).toBe(lista[1].id);

    // Elemento intermediário
    const meio = vizinhas(lista, lista[10].id);
    expect(meio.posicaoAtual).toBe(11);
    expect(meio.anterior?.id).toBe(lista[9].id);
    expect(meio.proxima?.id).toBe(lista[11].id);

    // Último elemento
    const ult = vizinhas(lista, lista[80].id);
    expect(ult.posicaoAtual).toBe(81);
    expect(ult.anterior?.id).toBe(lista[79].id);
    expect(ult.proxima).toBeNull();

    // ID não encontrado
    const naoExiste = vizinhas(lista, 'id-inexistente');
    expect(naoExiste.posicaoAtual).toBe(0);
    expect(naoExiste.anterior).toBeNull();
    expect(naoExiste.proxima).toBeNull();
  });
});
