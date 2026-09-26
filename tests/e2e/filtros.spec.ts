import { test, expect } from '@playwright/test';

test.describe('Filtros do Banco de Questões', () => {
  test('ano 2025 limita opções de prova e filtra 162 questões', async ({ page }) => {
    await page.goto('/#/');

    // Seleciona ano 2025
    await page.selectOption('#filtro-ano', '2025');

    // Opções de prova devem conter apenas P1 e P5 (além de todas)
    const opcoes = await page.$$eval('#filtro-prova option', (opts) =>
      opts.map((o) => (o as HTMLOptionElement).value)
    );
    expect(opcoes).toContain('todas');
    expect(opcoes).toContain('2025-prova1');
    expect(opcoes).toContain('2025-prova5');
    expect(opcoes).not.toContain('2021-licenciatura');

    // Total de questões exibido
    await expect(page.locator('text=162 questões encontradas')).toBeVisible();
  });

  test('selecionar prova 2025-prova1 lista exatamente 81 questões', async ({ page }) => {
    await page.goto('/#/');

    await page.selectOption('#filtro-ano', '2025');
    await page.selectOption('#filtro-prova', '2025-prova1');

    await expect(page.locator('text=81 questões encontradas')).toBeVisible();

    // Cards renderizados
    const cards = page.locator('a[href*="/questao/2025-prova1-"]');
    await expect(cards).toHaveCount(81);
  });
});
