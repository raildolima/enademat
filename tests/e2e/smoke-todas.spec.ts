import { test, expect } from '@playwright/test';

test.describe('Smoke Tests de Integridade', () => {
  // Amostra representativa das 3 provas cobrindo discursivas, matrizes, figuras e fórmulas
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
  ];

  for (const qId of questoesAmostra) {
    test(`renderiza questão e resolução sem erros: ${qId}`, async ({ page }) => {
      const errosConsole: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errosConsole.push(msg.text());
        }
      });

      // 1. Tela da questão
      await page.goto(`/#/questao/${qId}`);
      await expect(page.locator('h1')).toBeVisible();

      // Sem erros do KaTeX
      const katexErrors = page.locator('.katex-error');
      await expect(katexErrors).toHaveCount(0);

      // Imagens com carregamento válido se houver
      const imagens = page.locator('img');
      const countImg = await imagens.count();
      for (let i = 0; i < countImg; i++) {
        const img = imagens.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }

      // 2. Tela da resolução
      await page.goto(`/#/questao/${qId}/resolucao`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.katex-error')).toHaveCount(0);

      // Verifica que não houve erro fatal no console
      expect(errosConsole.filter((e) => !e.includes('favicon'))).toEqual([]);
    });
  }
});
