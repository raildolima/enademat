import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ItemIndice {
  id: string;
  provaId: string;
  rotulo: string;
}

const indice: { questoes: ItemIndice[] } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'src/data/generated/indice.json'), 'utf-8')
);
const rotuloPorId = new Map(indice.questoes.map((q) => [q.id, q.rotulo]));

// Navegar só trocando o hash mantém o documento: esperar o h1 com o texto da tela nova garante
// que as checagens seguintes olham o DOM desta questão, e não o da anterior (CR-27).
async function abrirTela(page: Page, url: string, tituloEsperado: string): Promise<void> {
  await page.goto(url);
  await expect(page.locator('h1')).toHaveText(tituloEsperado);
}

// Imagens usam loading="lazy": cada uma é trazida à viewport antes de conferir naturalWidth.
async function conferirImagens(page: Page, contexto: string): Promise<void> {
  const imagens = page.locator('main img');
  const total = await imagens.count();
  for (let i = 0; i < total; i++) {
    const img = imagens.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth), {
        message: `${contexto}: imagem ${i + 1} (${await img.getAttribute('src')}) sem carregar`,
      })
      .toBeGreaterThan(0);
  }
}

async function conferirQuestaoEResolucao(page: Page, id: string): Promise<void> {
  const rotulo = rotuloPorId.get(id);
  expect(rotulo, `questão ${id} ausente do índice`).toBeDefined();

  await abrirTela(page, `/#/questao/${id}`, rotulo!);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await conferirImagens(page, id);

  await abrirTela(page, `/#/questao/${id}/resolucao`, `Resolução · ${rotulo}`);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await conferirImagens(page, `${id}/resolucao`);
}

function coletarErrosConsole(page: Page, prefixo: string): string[] {
  const erros: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') erros.push(`${prefixo} ${msg.text()}`);
  });
  return erros;
}

test.describe('Smoke Tests de Integridade', () => {
  // Amostra representativa detalhada das 4 provas cobrindo discursivas, matrizes, figuras e fórmulas
  const questoesAmostra = [
    // 2021-licenciatura
    '2021-licenciatura-d01',
    '2021-licenciatura-d04',
    '2021-licenciatura-q002', // com figura
    '2021-licenciatura-q009', // gráfico vetorial
    '2021-licenciatura-q011', // elipse
    '2021-licenciatura-q022', // alternativas em gráficos WebP
    // 2025-prova1
    '2025-prova1-d01',
    '2025-prova1-q001',
    '2025-prova1-q032', // fórmula e texto-base
    '2025-prova1-q050', // alternativas-imagem
    '2025-prova1-q079', // alternativas-imagem
    // 2025-prova5
    '2025-prova5-d01',
    '2025-prova5-q001',
    '2025-prova5-q066', // matrizes
    '2025-prova5-q080',
    // 2026-prova1
    '2026-prova1-d01',
    '2026-prova1-q001', // figura no enunciado
    '2026-prova1-q047', // alternativas-imagem
    '2026-prova1-q066', // texto-base com figura
    '2026-prova1-q079', // alternativas-imagem
  ];

  for (const qId of questoesAmostra) {
    test(`renderiza questão e resolução sem erros: ${qId}`, async ({ page }) => {
      const errosConsole = coletarErrosConsole(page, `[${qId}]`);
      await conferirQuestaoEResolucao(page, qId);
      expect(errosConsole.filter((e) => !e.includes('favicon'))).toEqual([]);
    });
  }

  // Validação consolidada de cobertura de 100% das 283 questões do simulador por prova
  const provas = ['2021-licenciatura', '2025-prova1', '2025-prova5', '2026-prova1'];

  for (const pId of provas) {
    const questoesDaProva = indice.questoes.filter((q) => q.provaId === pId);

    test(`varredura completa sem erro em todas as ${questoesDaProva.length} questões da prova ${pId}`, async ({
      page,
    }) => {
      test.setTimeout(300 * 1000); // tempo suficiente para varredura com imagens
      const errosConsole = coletarErrosConsole(page, `[${pId}]`);

      for (const item of questoesDaProva) {
        await conferirQuestaoEResolucao(page, item.id);
      }

      expect(errosConsole.filter((e) => !e.includes('favicon'))).toEqual([]);
    });
  }
});
