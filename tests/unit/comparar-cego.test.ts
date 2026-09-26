import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { executarComparacaoCega, salvarRelatorioCego } from '../../scripts/content/comparar-cego';

// Raiz temporária com gabarito e respostas cegas próprias: o teste não lê nem grava em work/ do projeto.
const PROVA = '2025-prova1';
let raiz: string;

function gravarCego(nome: string, dados: object): void {
  fs.writeFileSync(path.join(raiz, 'work/cego', PROVA, nome), JSON.stringify(dados), 'utf-8');
}

beforeEach(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'enade-comparar-cego-'));
  fs.mkdirSync(path.join(raiz, 'content/provas', PROVA), { recursive: true });
  fs.mkdirSync(path.join(raiz, 'work/cego', PROVA), { recursive: true });
  fs.writeFileSync(
    path.join(raiz, 'content/provas', PROVA, 'gabarito.json'),
    JSON.stringify({ provaId: PROVA, fonte: 'gabarito.pdf', objetivas: { '32': 'D', '33': 'A' }, discursivas: ['D1'] }),
    'utf-8'
  );
  gravarCego('q032.json', { questaoId: `${PROVA}-q032`, respostaCega: 'D', raciocinioCurto: 'Modelo exponencial.' });
  gravarCego('q033.json', { questaoId: `${PROVA}-q033`, respostaCega: 'B', raciocinioCurto: 'Leitura do gráfico.' });
  gravarCego('d01.json', { questaoId: `${PROVA}-d01`, respostaCega: 'Texto livre.', raciocinioCurto: 'Discursiva.' });
});

afterEach(() => {
  fs.rmSync(raiz, { recursive: true, force: true });
});

describe('comparar-cego.ts', () => {
  it('compara respostas cegas contra o gabarito oficial', () => {
    const res = executarComparacaoCega(PROVA, raiz);
    expect(res.total).toBe(3);
    expect(res.iguais).toBe(2);
    expect(res.diferentes).toBe(1);

    const q032 = res.questoes.find((q) => q.questaoId === `${PROVA}-q032`);
    expect(q032).toMatchObject({ respostaCega: 'D', gabarito: 'D', coincide: true });
    const q033 = res.questoes.find((q) => q.questaoId === `${PROVA}-q033`);
    expect(q033).toMatchObject({ respostaCega: 'B', gabarito: 'A', coincide: false });
  });

  it('grava o relatório dentro da raiz informada', () => {
    const relPath = salvarRelatorioCego(executarComparacaoCega(PROVA, raiz), raiz);
    expect(relPath).toBe(path.join(raiz, 'work/relatorios', `cego-${PROVA}.md`));
    expect(fs.readFileSync(relPath, 'utf-8')).toContain('Divergências identificadas: **1**');
  });
});
