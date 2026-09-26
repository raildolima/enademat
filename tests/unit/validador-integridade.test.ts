import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { executarValidacaoCompleta } from '../../scripts/content/validate';

// Cada teste valida uma cópia isolada de content/provas/2025-prova1 (e suas figuras)
// em um diretório temporário, sem tocar em content/, public/ ou work/ do projeto.
const PROVA = '2025-prova1';
const RAIZ_PROJETO = process.cwd();
let modelo: string;

function novaRaiz(): string {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'enade-validador-'));
  fs.cpSync(modelo, raiz, { recursive: true });
  return raiz;
}

function arquivo(raiz: string, rel: string): string {
  return path.join(raiz, 'content/provas', PROVA, rel);
}

function lerJson(raiz: string, rel: string): any {
  return JSON.parse(fs.readFileSync(arquivo(raiz, rel), 'utf-8'));
}

function gravarJson(raiz: string, rel: string, dados: unknown): void {
  fs.writeFileSync(arquivo(raiz, rel), JSON.stringify(dados, null, 2), 'utf-8');
}

function validar(raiz: string, extra: { release?: boolean } = {}) {
  return executarValidacaoCompleta({ provaId: PROVA, raiz, ...extra });
}

function temErro(erros: string[], trecho: string): boolean {
  return erros.some((e) => e.includes(trecho));
}

describe('Validador de conteúdo — integridade da prova (especificação 0.13)', () => {
  beforeAll(() => {
    modelo = fs.mkdtempSync(path.join(os.tmpdir(), 'enade-modelo-'));
    fs.cpSync(path.join(RAIZ_PROJETO, 'content/provas', PROVA), path.join(modelo, 'content/provas', PROVA), {
      recursive: true,
    });
    fs.cpSync(path.join(RAIZ_PROJETO, 'public/figuras', PROVA), path.join(modelo, 'public/figuras', PROVA), {
      recursive: true,
    });
  });

  afterAll(() => {
    fs.rmSync(modelo, { recursive: true, force: true });
  });

  it('aprova a cópia íntegra da prova', () => {
    const res = validar(novaRaiz());
    expect(res.erros).toEqual([]);
    expect(res.valido).toBe(true);
  });

  it('CR-14: rejeita respostaIndependente divergente do arquivo cego .json correspondente à resolução .md', () => {
    const raiz = novaRaiz();
    const dirCego = path.join(raiz, 'work/cego', PROVA);
    fs.mkdirSync(dirCego, { recursive: true });
    // Gabarito e resolução da q032: D. Resposta cega registrada: C.
    fs.writeFileSync(
      path.join(dirCego, 'q032.json'),
      JSON.stringify({ questaoId: `${PROVA}-q032`, respostaCega: 'C', raciocinioCurto: 'teste' }),
      'utf-8'
    );
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'etapa cega')).toBe(true);
  });

  it('CR-14: não compara texto livre da etapa cega em discursivas', () => {
    const raiz = novaRaiz();
    const dirCego = path.join(raiz, 'work/cego', PROVA);
    fs.mkdirSync(dirCego, { recursive: true });
    fs.writeFileSync(
      path.join(dirCego, 'd01.json'),
      JSON.stringify({ questaoId: `${PROVA}-d01`, respostaCega: 'Texto livre diferente do resumo da resolução.' }),
      'utf-8'
    );
    expect(validar(raiz).erros).toEqual([]);
  });

  it('CR-15: --release rejeita resolução com verificacao: reprovada', () => {
    const raiz = novaRaiz();
    const md = arquivo(raiz, 'resolucoes/q040.md');
    fs.writeFileSync(md, fs.readFileSync(md, 'utf-8').replace('verificacao: aprovada', 'verificacao: reprovada'), 'utf-8');
    const res = validar(raiz, { release: true });
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'verificacao: aprovada')).toBe(true);
  });

  it('CR-16: rejeita contagem de questões diferente de 80 objetivas + 1 discursiva', () => {
    const raiz = novaRaiz();
    fs.rmSync(arquivo(raiz, 'questoes/q040.json'));
    fs.rmSync(arquivo(raiz, 'resolucoes/q040.md'));
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Contagem de questões')).toBe(true);
  });

  it('CR-16: rejeita questão sem resolução', () => {
    const raiz = novaRaiz();
    fs.rmSync(arquivo(raiz, 'resolucoes/q040.md'));
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Resolução ausente')).toBe(true);
  });

  it('CR-16: rejeita gabarito sem uma questão da referência', () => {
    const raiz = novaRaiz();
    const gab = lerJson(raiz, 'gabarito.json');
    delete gab.objetivas['32'];
    gravarJson(raiz, 'gabarito.json', gab);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Gabarito sem a questão 32')).toBe(true);
  });

  it('CR-16: rejeita gabarito com questão fora da referência', () => {
    const raiz = novaRaiz();
    const gab = lerJson(raiz, 'gabarito.json');
    gab.objetivas['81'] = 'A';
    gravarJson(raiz, 'gabarito.json', gab);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'questão 81 inexistente na referência')).toBe(true);
  });

  it('CR-16: rejeita textoBaseId inexistente', () => {
    const raiz = novaRaiz();
    const q = lerJson(raiz, 'questoes/q032.json');
    q.textoBaseId = 'tb-99-99';
    gravarJson(raiz, 'questoes/q032.json', q);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'textoBaseId "tb-99-99" não existe')).toBe(true);
  });

  it('CR-16: rejeita texto-base que não lista a questão que o referencia', () => {
    const raiz = novaRaiz();
    const tb = lerJson(raiz, 'textos-base/tb-31-32.json');
    tb.questoes = [31];
    gravarJson(raiz, 'textos-base/tb-31-32.json', tb);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'não lista a questão 32')).toBe(true);
  });

  it('CR-16: rejeita figura do manifesto com status pendente', () => {
    const raiz = novaRaiz();
    const man = lerJson(raiz, 'figuras.manifest.json');
    man.figuras[0].status = 'pendente';
    gravarJson(raiz, 'figuras.manifest.json', man);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'status "pendente"')).toBe(true);
  });

  it('CR-16: rejeita figura órfã no manifesto', () => {
    const raiz = novaRaiz();
    const man = lerJson(raiz, 'figuras.manifest.json');
    man.figuras.push({ ...man.figuras[0], arquivo: 'q099-f1.webp' });
    gravarJson(raiz, 'figuras.manifest.json', man);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Figura órfã no manifesto: q099-f1.webp')).toBe(true);
  });

  it('CR-16: rejeita imagem usada no conteúdo sem registro no manifesto', () => {
    const raiz = novaRaiz();
    const man = lerJson(raiz, 'figuras.manifest.json');
    const removida = man.figuras.shift().arquivo;
    gravarJson(raiz, 'figuras.manifest.json', man);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, `${removida}" não registrada em figuras.manifest.json`)).toBe(true);
  });

  it('CR-16: rejeita id/numero incoerentes com o nome do arquivo', () => {
    const raiz = novaRaiz();
    const q = lerJson(raiz, 'questoes/q032.json');
    q.numero = 33;
    gravarJson(raiz, 'questoes/q032.json', q);
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'incoerente com o arquivo')).toBe(true);
  });

  it('CR-16: rejeita questaoId da resolução incoerente com o arquivo', () => {
    const raiz = novaRaiz();
    const md = arquivo(raiz, 'resolucoes/q040.md');
    fs.writeFileSync(md, fs.readFileSync(md, 'utf-8').replace(`questaoId: ${PROVA}-q040`, `questaoId: ${PROVA}-q041`), 'utf-8');
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'questaoId')).toBe(true);
  });

  it('CR-20: objetiva exige letra em respostaIndependente', () => {
    const raiz = novaRaiz();
    const md = arquivo(raiz, 'resolucoes/q040.md');
    fs.writeFileSync(
      md,
      fs.readFileSync(md, 'utf-8').replace('respostaIndependente: A', 'respostaIndependente: "Área do paralelogramo"'),
      'utf-8'
    );
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'respostaIndependente')).toBe(true);
  });

  it('CR-20: discursiva aceita resumo em texto livre, mas não vazio', () => {
    const raiz = novaRaiz();
    expect(validar(raiz).erros).toEqual([]);
    const md = arquivo(raiz, 'resolucoes/d01.md');
    fs.writeFileSync(md, fs.readFileSync(md, 'utf-8').replace(/^respostaIndependente: .*$/m, 'respostaIndependente: ""'), 'utf-8');
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'respostaIndependente')).toBe(true);
  });

  it('CR-24: rejeita a pasta legada questoes-discursivas/, que o build ignora', () => {
    const raiz = novaRaiz();
    fs.mkdirSync(arquivo(raiz, 'questoes-discursivas'));
    fs.copyFileSync(arquivo(raiz, 'questoes/d01.json'), arquivo(raiz, 'questoes-discursivas/d01.json'));
    const res = validar(raiz);
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'questoes-discursivas')).toBe(true);
  });

  it('CR-17: rejeita --prova com id inexistente', () => {
    const res = executarValidacaoCompleta({ provaId: '2025-prova9', raiz: novaRaiz() });
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Prova inexistente')).toBe(true);
  });

  it('CR-17: rejeita --arquivo .json de tipo não reconhecido', () => {
    const raiz = novaRaiz();
    fs.writeFileSync(arquivo(raiz, 'outro.json'), '{}', 'utf-8');
    const res = executarValidacaoCompleta({ arquivo: `content/provas/${PROVA}/outro.json`, raiz });
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Tipo de arquivo não reconhecido')).toBe(true);
  });

  it('CR-17: rejeita --arquivo .md fora de content/provas/<provaId>/resolucoes', () => {
    const raiz = novaRaiz();
    fs.writeFileSync(path.join(raiz, 'solto.md'), fs.readFileSync(arquivo(raiz, 'resolucoes/q040.md')));
    const res = executarValidacaoCompleta({ arquivo: 'solto.md', raiz });
    expect(res.valido).toBe(false);
    expect(temErro(res.erros, 'Tipo de arquivo não reconhecido')).toBe(true);
  });
});
