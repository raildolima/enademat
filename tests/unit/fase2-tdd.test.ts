import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { QuestaoSchema, validarTextoRico, validarLatex } from '../../scripts/content/schema';
import {
  validarQuestaoObj,
  validarResolucaoMarkdown,
  validarGabaritoComReferencia,
  validarImagemBloco,
} from '../../scripts/content/validate';
import { compilarConteudo } from '../../scripts/content/build';
import { gerarConferenciaHtml } from '../../scripts/content/conferencia';

const FIXTURES_DIR = path.resolve(__dirname, '../../scripts/content/__fixtures__');

describe('Fase 2 — TDD: Validador, Esquema, Build e Conferência', () => {
  let q032Valida: any;
  let resolucaoValida: string;

  beforeEach(() => {
    const qRaw = fs.readFileSync(path.join(FIXTURES_DIR, 'questoes/q032.json'), 'utf-8');
    q032Valida = JSON.parse(qRaw);
    resolucaoValida = fs.readFileSync(path.join(FIXTURES_DIR, 'resolucoes/q032.md'), 'utf-8');
  });

  // 1. Aceita q032
  it('1. aceita a questão q032 válida', () => {
    const parsed = QuestaoSchema.safeParse(q032Valida);
    expect(parsed.success).toBe(true);
    const validacao = validarQuestaoObj(q032Valida);
    expect(validacao.valido).toBe(true);
    expect(validacao.erros).toHaveLength(0);
  });

  // 2. Rejeita objetiva com 3 alternativas
  it('2. rejeita questão objetiva com 3 alternativas', () => {
    const qInvalida = JSON.parse(JSON.stringify(q032Valida));
    qInvalida.alternativas = qInvalida.alternativas.slice(0, 3);
    const validacao = validarQuestaoObj(qInvalida);
    expect(validacao.valido).toBe(false);
    expect(validacao.erros.some((e: string) => e.includes('alternativas'))).toBe(true);
  });

  // 3. Rejeita "R$" sem barra
  it('3. rejeita "R$" sem barra invertida (deve ser R\\$)', () => {
    const textoInvalido = 'O valor da taxa é R$ 25,00.';
    const checagem = validarTextoRico(textoInvalido);
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('R$'))).toBe(true);

    const textoValido = 'O valor da taxa é R\\$ 25,00.';
    expect(validarTextoRico(textoValido).valido).toBe(true);
  });

  // 4. Rejeita LaTeX inválido
  it('4. rejeita LaTeX com erro de compilação no KaTeX', () => {
    const latexInvalido = '\\frac{1}{0'; // falta fechar chave
    const checagem = validarLatex(latexInvalido);
    expect(checagem.valido).toBe(false);

    const latexValido = '\\frac{1}{2}';
    expect(validarLatex(latexValido).valido).toBe(true);
  });

  // 5. Rejeita gabarito diferente da seção 0.7
  it('5. rejeita gabarito divergente das referências oficiais da seção 0.7', () => {
    const gabaritoDivergente = {
      provaId: '2025-prova1',
      fonte: '2025 - Matemática - Gabarito 1.pdf',
      objetivas: {
        '1': 'A', // Oficial da seção 0.7 é 'D'
      },
      discursivas: ['D1'],
    };
    const checagem = validarGabaritoComReferencia(gabaritoDivergente as any);
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('divergência'))).toBe(true);
  });

  // 6. Rejeita imagem inexistente ou alt curto
  it('6. rejeita imagem inexistente ou com alt menor que 15 caracteres', () => {
    const blocoImgInexistente = {
      tipo: 'imagem',
      src: 'figuras/2025-prova1/inexistente.webp',
      alt: 'Gráfico da curva de decaimento com dados',
    };
    const checagem1 = validarImagemBloco(blocoImgInexistente as any);
    expect(checagem1.valido).toBe(false);
    expect(checagem1.erros.some((e: string) => e.includes('inexistente') || e.includes('não encontrada'))).toBe(true);

    const blocoAltCurto = {
      tipo: 'imagem',
      src: 'figuras/2025-prova1/q032-teste.webp',
      alt: 'Gráfico', // curto (< 15)
    };
    const checagem2 = validarImagemBloco(blocoAltCurto as any);
    expect(checagem2.valido).toBe(false);
    expect(checagem2.erros.some((e: string) => e.includes('alt'))).toBe(true);
  });

  // 7. Rejeita resolução sem "## Análise das alternativas"
  it('7. rejeita resolução sem a seção obrigatória "## Análise das alternativas"', () => {
    const resolucaoSemAnalise = resolucaoValida.replace(
      /## Análise das alternativas[\s\S]*?(?=## Conceitos envolvidos)/,
      ''
    );
    const checagem = validarResolucaoMarkdown(resolucaoSemAnalise, 'D', { provaId: '2025-prova1', numero: 32 });
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('Análise das alternativas'))).toBe(true);
  });

  // 8. Rejeita respostaFinal diferente do gabarito
  it('8. rejeita resolução com respostaFinal diferente do gabarito oficial', () => {
    const checagem = validarResolucaoMarkdown(resolucaoValida, 'B', { provaId: '2025-prova1', numero: 32 }); // oficial é D
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('respostaFinal'))).toBe(true);
  });

  // 9. Rejeita respostaIndependente diferente de work/cego quando o arquivo cego existir
  it('9. rejeita respostaIndependente divergente da resposta cega gravada em work/cego', () => {
    // Raiz temporária: o teste nunca toca o work/cego real do projeto.
    const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'enade-cego-'));
    const cegoDir = path.join(raiz, 'work/cego/2025-prova1');
    fs.mkdirSync(cegoDir, { recursive: true });
    fs.writeFileSync(
      path.join(cegoDir, 'q032.json'),
      JSON.stringify({ questaoId: '2025-prova1-q032', resposta: 'C', confianca: 'alta' }),
      'utf-8'
    );

    try {
      // resolucaoValida tem respostaIndependente: D, mas no cego está C
      const checagem = validarResolucaoMarkdown(
        resolucaoValida,
        'D',
        { provaId: '2025-prova1', numero: 32, arquivoNome: 'q032.md' },
        { raiz }
      );
      expect(checagem.valido).toBe(false);
      expect(checagem.erros.some((e: string) => e.includes('respostaIndependente') || e.includes('etapa cega'))).toBe(
        true
      );
    } finally {
      fs.rmSync(raiz, { recursive: true, force: true });
    }
  });

  it('10b. flag --release rejeita resoluções com verificação reprovada', () => {
    const resolucaoReprovada = resolucaoValida.replace('verificacao: aprovada', 'verificacao: reprovada');
    const checagem = validarResolucaoMarkdown(
      resolucaoReprovada,
      'D',
      { provaId: '2025-prova1', numero: 32 },
      { release: true }
    );
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('verificacao: aprovada'))).toBe(true);
  });

  // 10. --release rejeita verificacao pendente
  it('10. flag --release rejeita resoluções com verificação pendente', () => {
    const resolucaoPendente = resolucaoValida.replace('verificacao: aprovada', 'verificacao: pendente');
    const checagem = validarResolucaoMarkdown(
      resolucaoPendente,
      'D',
      { provaId: '2025-prova1', numero: 32 },
      { release: true }
    );
    expect(checagem.valido).toBe(false);
    expect(checagem.erros.some((e: string) => e.includes('pendente'))).toBe(true);
  });

  // 11. Build gera índice e JSON por prova
  it('11. build gera índice.json e arquivo JSON da prova estruturado', () => {
    const resultado = compilarConteudo({ dryRun: true });
    expect(resultado).toBeDefined();
    expect(resultado.indice).toBeDefined();
    expect(resultado.provas).toBeDefined();
  });

  // 12. Conferencia gera HTML
  it('12. script de conferência gera HTML estruturado', () => {
    const html = gerarConferenciaHtml('2025-prova1', { dryRun: true });
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Conferência');
  });
});
