import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Critério do projeto: WCAG 2.2 AA (inclui os níveis 2.0 e 2.1).
const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function violacoesGraves(page: Page) {
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  return resultado.violations
    .filter((v) => v.impact === 'critical' || v.impact === 'serious')
    .map((v) => ({ id: v.id, impacto: v.impact, alvos: v.nodes.map((n) => n.target.join(' ')) }));
}

test.describe('Acessibilidade (WCAG 2.2 AA)', () => {
  test('página inicial do Banco não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.getByRole('status')).toBeVisible();
    expect(await violacoesGraves(page)).toEqual([]);
  });

  test('tela da questão não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/questao/2025-prova1-q032');
    await expect(page.locator('h1')).toHaveText('Questão 32');
    expect(await violacoesGraves(page)).toEqual([]);
  });

  test('tela da resolução não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/questao/2025-prova1-q032/resolucao?marcada=B');
    await expect(page.locator('h1')).toHaveText('Resolução · Questão 32');
    expect(await violacoesGraves(page)).toEqual([]);
  });

  test('pop-up da questão aberto não possui violações críticas de acessibilidade', async ({ page }) => {
    await page.goto('/#/questao/2025-prova1-q032/resolucao');
    await page.getByRole('button', { name: 'Ver questão' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await violacoesGraves(page)).toEqual([]);
  });
});
