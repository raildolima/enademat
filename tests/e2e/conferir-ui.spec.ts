import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

test.describe('Conferência Visual e Capturas de Evidência (Skill conferir-ui)', () => {
  const outDir = path.resolve(process.cwd(), 'work/conferencia/ui');

  test.beforeAll(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  });

  test('gera capturas de tela dos estados chave da interface', async ({ page }, testInfo) => {
    // Executa apenas uma vez no projeto desktop
    if (testInfo.project.name.includes('mobile')) {
      return;
    }

    // 1. Banco Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/#/?ano=2025&prova=2025-prova1');
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(outDir, '01-banco-desktop-1280.png') });

    // 2. Questão 32 com B marcada
    await page.goto('/#/questao/2025-prova1-q032');
    await page.waitForSelector('h1');
    const altB = page.locator('div[role="radio"]').filter({ hasText: 'B' });
    await altB.click();
    await page.screenshot({ path: path.join(outDir, '02-questao-q032-marcada-b.png') });

    // 3. Resolução com Feedback
    await page.click('text=Ver gabarito');
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(outDir, '03-resolucao-q032-feedback.png') });

    // 4. Pop-up aberto no Desktop via hover
    const btnVerQuestao = page.locator('button:has-text("Ver questão")');
    await btnVerQuestao.hover();
    await page.waitForSelector('div[role="dialog"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, '04-popup-aberto-desktop.png') });

    // 5. Mobile (390 x 844) Banco
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#/');
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(outDir, '05-mobile-390-banco.png') });

    // 6. Mobile Pop-up com toque
    await page.goto('/#/questao/2025-prova1-q032/resolucao?marcada=B');
    await page.waitForSelector('h1');
    const btnVerQuestaoMobile = page.locator('button:has-text("Ver questão")');
    await btnVerQuestaoMobile.click();
    await page.waitForSelector('div[role="dialog"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, '06-mobile-390-popup-toque.png') });

    // 7. Discursiva 2021-d04 com rascunho
    await page.goto('/#/questao/2021-licenciatura-d04');
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(outDir, '07-discursiva-d04.png') });
  });
});
