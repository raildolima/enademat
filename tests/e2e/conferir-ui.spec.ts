import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Capturas de evidência da skill conferir-ui. Grava PNGs em work/conferencia/ui, então só roda sob
// demanda: CONFERIR_UI=1 npm run test:e2e -- conferir-ui (CR-30).
test.describe('Conferência Visual e Capturas de Evidência (Skill conferir-ui)', () => {
  test.skip(!process.env.CONFERIR_UI, 'Captura manual: defina CONFERIR_UI=1 para gerar as evidências.');
  const outDir = path.resolve(process.cwd(), 'work/conferencia/ui');

  test.beforeAll(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  });

  test('gera capturas de tela dos estados chave da interface', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Executa uma vez, no projeto desktop.');
    const capturar = (nome: string) =>
      page.screenshot({ path: path.join(outDir, nome), animations: 'disabled' });

    // 1. Banco Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/#/?ano=2025&prova=2025-prova1');
    await expect(page.getByRole('status')).toHaveText('81 questões encontradas');
    await capturar('01-banco-desktop-1280.png');

    // 2. Questão 32 com B marcada
    await page.goto('/#/questao/2025-prova1-q032');
    await expect(page.locator('h1')).toHaveText('Questão 32');
    const altB = page.getByRole('radio').nth(1);
    await altB.click();
    await expect(altB).toHaveAttribute('aria-checked', 'true');
    await capturar('02-questao-q032-marcada-b.png');

    // 3. Resolução com Feedback
    await page.getByRole('link', { name: 'Ver gabarito' }).click();
    await expect(page.locator('h1')).toHaveText('Resolução · Questão 32');
    await expect(page.getByText('Você marcou B — incorreta')).toBeVisible();
    await capturar('03-resolucao-q032-feedback.png');

    // 4. Pop-up aberto no Desktop via hover
    await page.getByRole('button', { name: 'Ver questão' }).hover();
    await expect(page.getByRole('dialog')).toBeVisible();
    await capturar('04-popup-aberto-desktop.png');

    // 5. Mobile (390 x 844) Banco
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/');
    await expect(page.locator('h1')).toHaveText('Banco de Questões');
    await capturar('05-mobile-390-banco.png');

    // 6. Mobile Pop-up com toque
    await page.goto('/#/questao/2025-prova1-q032/resolucao?marcada=B');
    await expect(page.locator('h1')).toHaveText('Resolução · Questão 32');
    await page.getByRole('button', { name: 'Ver questão' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await capturar('06-mobile-390-popup-toque.png');

    // 7. Discursiva 2021-d04 com rascunho
    await page.goto('/#/questao/2021-licenciatura-d04');
    await expect(page.getByRole('link', { name: 'Ver resposta esperada' })).toBeVisible();
    await capturar('07-discursiva-d04.png');
  });
});
