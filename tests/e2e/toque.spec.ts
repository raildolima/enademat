import { test, expect } from '@playwright/test';

test.describe('Interação Tátil em Dispositivos Móveis', () => {
  test('toque em "Ver questão" abre o pop-up e botão Fechar fecha', async ({ page }, testInfo) => {
    // Executa apenas em ambiente móvel com toque
    if (!testInfo.project.name.includes('mobile')) {
      test.skip();
    }

    await page.goto('/#/questao/2025-prova1-q032/resolucao');

    const btnVerQuestao = page.locator('button:has-text("Ver questão")');
    await expect(btnVerQuestao).toBeVisible();

    // Toque para abrir
    await btnVerQuestao.tap();

    const dialogo = page.locator('div[role="dialog"]');
    await expect(dialogo).toBeVisible();
    await expect(dialogo).toContainText('concentração de chumbo no solo');

    // Botão Fechar visível e funcional
    const btnFechar = dialogo.locator('button:has-text("Fechar")');
    await expect(btnFechar).toBeVisible();
    await btnFechar.tap();

    await expect(dialogo).not.toBeVisible();
  });
});
