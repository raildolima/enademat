import { test, expect } from '@playwright/test';

test.describe('Questões Discursivas', () => {
  test('2021-licenciatura-d04 exibe "Ver resposta esperada", campo de rascunho e padrão de resposta', async ({ page }) => {
    await page.goto('/#/questao/2021-licenciatura-d04');

    // Título e badges
    await expect(page.locator('h1')).toHaveText('Questão Discursiva 4');
    await expect(page.getByText('Discursiva', { exact: true })).toBeVisible();

    // Botão de ação
    const btnEsperada = page.locator('text=Ver resposta esperada');
    await expect(btnEsperada).toBeVisible();

    // Campo de rascunho
    const rascunho = page.locator('textarea#campo-rascunho');
    await expect(rascunho).toBeVisible();
    await rascunho.fill('Rascunho de teste para questão discursiva de limites.');
    await expect(rascunho).toHaveValue('Rascunho de teste para questão discursiva de limites.');

    // Clica para ver padrão de resposta
    await btnEsperada.click();
    await expect(page).toHaveURL(/.*#\/questao\/2021-licenciatura-d04\/resolucao/);

    // Na resolução: "Padrão de Resposta Esperado"
    await expect(page.locator('text=Padrão de Resposta Esperado')).toBeVisible();
  });
});
