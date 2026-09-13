import { test, expect } from '@playwright/test';

test.describe('PopupQuestao (Desktop e Teclado)', () => {
  test('abre pop-up ao passar mouse em "Ver questão", permanece aberto dentro e fecha ao sair ou com Esc', async ({ page }, testInfo) => {
    // Roda somente no projeto desktop
    if (testInfo.project.name.includes('mobile')) {
      test.skip();
    }

    await page.goto('/#/questao/2025-prova1-q032/resolucao');

    const btnVerQuestao = page.locator('button:has-text("Ver questão")');
    await expect(btnVerQuestao).toBeVisible();

    // Passa o mouse sobre o botão
    await btnVerQuestao.hover();
    const dialogo = page.locator('div[role="dialog"]');
    await expect(dialogo).toBeVisible();

    // Verifica que o enunciado está dentro do diálogo
    await expect(dialogo).toContainText('concentração de chumbo no solo');

    // Move o mouse para dentro do diálogo
    await dialogo.hover();
    await page.waitForTimeout(300);
    await expect(dialogo).toBeVisible();

    // Fecha com tecla Esc
    await page.keyboard.press('Escape');
    await expect(dialogo).not.toBeVisible();
  });

  test('abre pop-up com foco de teclado (Tab)', async ({ page }, testInfo) => {
    if (testInfo.project.name.includes('mobile')) {
      test.skip();
    }

    await page.goto('/#/questao/2025-prova1-q032/resolucao');

    // Dá foco no botão "Ver questão"
    const btnVerQuestao = page.locator('button:has-text("Ver questão")');
    await btnVerQuestao.focus();

    const dialogo = page.locator('div[role="dialog"]');
    await expect(dialogo).toBeVisible();

    // Esc fecha
    await page.keyboard.press('Escape');
    await expect(dialogo).not.toBeVisible();
  });
});
