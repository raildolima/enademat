import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { render } from '@testing-library/react';
import { imageSize } from 'image-size';
import { extrairPrevia, compilarConteudo } from '../../scripts/content/build';
import { Blocos } from '../../src/components/Blocos';

// Delimitadores de fórmula: "$" não precedido de barra (R\$ e \$ são moeda literal).
function contarDolares(texto: string): number {
  return (texto.match(/(?<!\\)\$/g) ?? []).length;
}

function contarNegrito(texto: string): number {
  return (texto.match(/\*\*/g) ?? []).length;
}

function paragrafo(texto: string) {
  return [{ tipo: 'paragrafo', texto }];
}

function coletarImagens(valor: unknown, destino: any[] = []): any[] {
  if (Array.isArray(valor)) valor.forEach((v) => coletarImagens(v, destino));
  else if (valor && typeof valor === 'object') {
    if ((valor as any).tipo === 'imagem') destino.push(valor);
    Object.values(valor).forEach((v) => coletarImagens(v, destino));
  }
  return destino;
}

const compilado = compilarConteudo({ dryRun: true });

describe('CR-10 — prévia do banco preserva LaTeX', () => {
  it('mantém a fórmula com os delimitadores $', () => {
    expect(extrairPrevia(paragrafo('Seja $f(x) = \\frac{1}{x}$ uma função.'))).toBe('Seja $f(x) = \\frac{1}{x}$ uma função.');
  });

  it('não corta uma fórmula ao meio em textos longos', () => {
    const texto = `${'Texto introdutório da questão. '.repeat(4)}Considere $\\displaystyle\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$ e responda ao que se pede em seguida.`;
    const previa = extrairPrevia(paragrafo(texto));
    expect(previa.endsWith('...')).toBe(true);
    expect(contarDolares(previa) % 2).toBe(0);
  });

  it('não corta um negrito ao meio', () => {
    const texto = `${'Contexto da situação apresentada. '.repeat(3)}**trecho em negrito bastante longo que atravessa o limite da prévia do banco** e continua.`;
    const previa = extrairPrevia(paragrafo(texto));
    expect(contarNegrito(previa) % 2).toBe(0);
  });

  it('trata R\\$ como moeda, não como delimitador de fórmula', () => {
    const texto = `O produto custa R\\$ 25{,}00 e o serviço custa R\\$ 40{,}00. ${'Informação adicional sobre a compra. '.repeat(4)}`;
    const previa = extrairPrevia(paragrafo(texto));
    expect(previa.startsWith('O produto custa R\\$ 25{,}00 e o serviço custa R\\$ 40{,}00.')).toBe(true);
  });

  it('todas as prévias geradas têm fórmulas e negritos balanceados e sem LaTeX despido', () => {
    for (const q of compilado.indice.questoes) {
      expect(contarDolares(q.previa) % 2, q.id).toBe(0);
      expect(contarNegrito(q.previa) % 2, q.id).toBe(0);
    }
    const q020 = compilado.indice.questoes.find((q) => q.id === '2021-licenciatura-q020');
    expect(q020?.previa).toContain('$');
    expect(q020?.previa).not.toMatch(/(?<!\\)frac\{/);
  });
});

describe('CR-11 — dimensões das imagens', () => {
  it('build anota largura e altura reais em todos os blocos de imagem', () => {
    const imagens = coletarImagens(compilado.provas);
    expect(imagens.length).toBeGreaterThan(0);
    for (const img of imagens) {
      const arquivo = path.resolve(process.cwd(), 'public', img.src.replace(/^\.?\//, ''));
      const dim = imageSize(fs.readFileSync(arquivo));
      expect({ src: img.src, largura: img.largura, altura: img.altura }).toEqual({
        src: img.src,
        largura: dim.width,
        altura: dim.height,
      });
    }
  });

  it('Blocos repassa largura e altura como atributos do <img>', () => {
    const { container } = render(
      <Blocos
        blocos={[
          {
            tipo: 'imagem',
            src: '/figuras/2025-prova1/q050-alt-a.webp',
            alt: 'Gráfico da alternativa A da questão 50',
            largura: 640,
            altura: 480,
          },
        ]}
      />
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('640');
    expect(img?.getAttribute('height')).toBe('480');
  });
});
