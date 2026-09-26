import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { extrairCaminhosConteudo } from '../../scripts/hooks/antigravity-validar.mjs';

const RAIZ = process.cwd();
const COPIAS_PROTEGER = ['scripts/hooks/antigravity-proteger.mjs', '.agents/scripts/hooks/antigravity-proteger.mjs'];
const COPIAS_VALIDAR = ['scripts/hooks/antigravity-validar.mjs', '.agents/scripts/hooks/antigravity-validar.mjs'];

function executarHook(script: string, entrada: string, cwd: string) {
  return spawnSync(process.execPath, [path.join(RAIZ, script)], { input: entrada, cwd, encoding: 'utf-8' });
}

describe('CR-19 — hook de validação reconhece caminhos do Windows', () => {
  const esperado = ['content/provas/2025-prova1/questoes/q032.json'];

  it('caminho absoluto com barras invertidas e espaços', () => {
    const entrada = 'Arquivo editado: C:\\Users\\Raildo Lima\\Desktop\\Enade_simulador - CLAUDE\\content\\provas\\2025-prova1\\questoes\\q032.json';
    expect(extrairCaminhosConteudo(entrada)).toEqual(esperado);
  });

  it('caminho dentro de JSON (barras invertidas escapadas)', () => {
    const entrada = JSON.stringify({
      tool: 'replace_file_content',
      path: 'C:\\Users\\Raildo Lima\\Desktop\\Enade_simulador - CLAUDE\\content\\provas\\2025-prova1\\questoes\\q032.json',
    });
    expect(extrairCaminhosConteudo(entrada)).toEqual(esperado);
  });

  it('caminho relativo com barras normais, sem duplicatas', () => {
    const entrada = 'content/provas/2025-prova1/questoes/q032.json e de novo content/provas/2025-prova1/questoes/q032.json';
    expect(extrairCaminhosConteudo(entrada)).toEqual(esperado);
  });

  it('extrai resoluções .md e ignora arquivos fora de content/', () => {
    const entrada = 'src\\app\\x.json; content\\provas\\2021-licenciatura\\resolucoes\\d01.md';
    expect(extrairCaminhosConteudo(entrada)).toEqual(['content/provas/2021-licenciatura/resolucoes/d01.md']);
  });
});

describe('CR-19 — cópias dos hooks em scripts/hooks e .agents/scripts/hooks', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'enade-hooks-'));
    fs.mkdirSync(path.join(tmp, 'work/cego'), { recursive: true });
    fs.mkdirSync(path.join(tmp, '.agents'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'work/cego/BLOQUEIO'), '', 'utf-8');
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  for (const copia of COPIAS_PROTEGER) {
    it(`${copia}: bloqueia gabarito.json na etapa cega com cwd na raiz`, () => {
      const res = executarHook(copia, 'view_file content/provas/2025-prova1/gabarito.json', tmp);
      expect(JSON.parse(res.stdout)).toMatchObject({ decision: 'deny' });
    });

    it(`${copia}: bloqueia gabarito.json na etapa cega com cwd em .agents/`, () => {
      const res = executarHook(copia, 'view_file content/provas/2025-prova1/gabarito.json', path.join(tmp, '.agents'));
      expect(JSON.parse(res.stdout)).toMatchObject({ decision: 'deny' });
    });

    it(`${copia}: pede autorização para git push`, () => {
      const res = executarHook(copia, 'run_command git push origin master', tmp);
      expect(JSON.parse(res.stdout)).toMatchObject({ decision: 'ask' });
    });
  }

  it('as duas cópias de cada hook são o mesmo código-fonte', () => {
    for (const par of [COPIAS_PROTEGER, COPIAS_VALIDAR]) {
      const [original, copia] = par.map((p) => fs.readFileSync(path.join(RAIZ, p), 'utf-8'));
      const reexporta = copia.includes("from '../../../scripts/hooks/");
      expect(reexporta || copia === original, par[1]).toBe(true);
    }
  });
});
