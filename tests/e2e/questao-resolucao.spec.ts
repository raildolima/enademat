import { test, expect } from '@playwright/test';

test.describe('Fluxo Questão -> Resolução', () => {
  test('abre q032, marca B, navega para resolução e confere feedback do gabarito D', async ({ page }) => {
    await page.goto('/#/questao/2025-prova1-q032');

    // Enunciado e texto-base visíveis
    await expect(page.locator('h1', { hasText: 'Questão 32' })).toBeVisible();
    await expect(page.locator('text=Texto para questões 31 e 32')).toBeVisible();

    // Alternativas A, B, C, D presentes
    const altB = page.locator('div[role="radio"]').filter({ hasText: 'B' });
    await expect(altB).toBeVisible();

    // Clica na alternativa B
    await altB.click();
    await expect(altB).toHaveAttribute('aria-checked', 'true');

    // Clica em "Ver gabarito"
    await page.click('text=Ver gabarito');

    // URL deve conter /resolucao e ?marcada=B
    await expect(page).toHaveURL(/.*#\/questao\/2025-prova1-q032\/resolucao\?.*marcada=B/);

    // Na resolução: mostra Gabarito oficial: D
    const cartao = page.locator('section[aria-label="Gabarito oficial"]');
    await expect(cartao).toBeVisible();
    await expect(cartao.locator('strong', { hasText: 'D' })).toBeVisible();

    // Feedback de erro da alternativa B
    await expect(page.locator('text=Você marcou B — incorreta')).toBeVisible();

    // Não deve mostrar as outras alternativas no cartão de gabarito
    await expect(cartao).toContainText('7{,}2 \\times 10^{6}'); // Alternativa D
    await expect(cartao).not.toContainText('1{,}44 \\times 10^{7}'); // Alternativa A
  });
});
