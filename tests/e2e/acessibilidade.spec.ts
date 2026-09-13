import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade (WCAG 2.2 AA)', () => {
  test('página inicial do Banco não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForSelector('h1');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Filtra violações sérias e críticas
    const violacoesCriticas = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(violacoesCriticas).toEqual([]);
  });

  test('tela da questão não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/questao/2025-prova1-q032');
    await page.waitForSelector('h1');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violacoesCriticas = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(violacoesCriticas).toEqual([]);
  });
});
