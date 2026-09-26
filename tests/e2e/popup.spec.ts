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

  test('fecha ao tirar o mouse do gatilho e do pop-up', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Somente no projeto desktop.');
    await page.goto('/#/questao/2025-prova1-q032/resolucao');
    const dialogo = page.getByRole('dialog');

    await page.getByRole('button', { name: 'Ver questão' }).hover();
    await expect(dialogo).toBeVisible();
    // Movimento contínuo, como o de um mouse real: o safePolygon decide o fechamento a cada mousemove.
    await page.mouse.move(5, 5, { steps: 10 });
    await expect(dialogo).not.toBeVisible();
  });

  test('clique fora do pop-up fecha', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Somente no projeto desktop.');
    await page.goto('/#/questao/2025-prova1-q032/resolucao');
    const dialogo = page.getByRole('dialog');

    await page.getByRole('button', { name: 'Ver questão' }).click();
    await expect(dialogo).toBeVisible();
    await page.locator('footer[role="contentinfo"]').click();
    await expect(dialogo).not.toBeVisible();
  });

  test('Tab real a partir do elemento anterior abre o pop-up', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Somente no projeto desktop.');
    await page.goto('/#/questao/2025-prova1-q032/resolucao');
    const dialogo = page.getByRole('dialog');

    // O link do logotipo é o último elemento focável antes do gatilho "Ver questão".
    // O cabeçalho aparece antes da página (rota lazy): espera a resolução renderizar.
    await expect(page.locator('h1')).toHaveText('Resolução · Questão 32');
    await page.getByRole('link', { name: 'Ir para página inicial do Simulador ENADE' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Ver questão' })).toBeFocused();
    await expect(dialogo).toBeVisible();
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

  test('Tab a partir do gatilho entra no pop-up; Fechar devolve o foco ao gatilho', async ({ page }, testInfo) => {
    if (testInfo.project.name.includes('mobile')) {
      test.skip();
    }

    await page.goto('/#/questao/2025-prova1-q032/resolucao');

    const btnVerQuestao = page.locator('button:has-text("Ver questão")');
    await btnVerQuestao.focus();
    const dialogo = page.locator('div[role="dialog"]');
    await expect(dialogo).toBeVisible();

    // Tab real: o foco precisa entrar no diálogo (botão Fechar), e o diálogo segue aberto
    await page.keyboard.press('Tab');
    const btnFechar = dialogo.getByRole('button', { name: 'Fechar pop-up da questão' });
    await expect(btnFechar).toBeFocused();
    await expect(dialogo).toBeVisible();

    // Enter em Fechar fecha e devolve o foco ao gatilho
    await page.keyboard.press('Enter');
    await expect(dialogo).not.toBeVisible();
    await expect(btnVerQuestao).toBeFocused();
  });
});
