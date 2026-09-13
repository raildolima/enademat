import { chromium } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function gerarCapturasUI() {
  const outDir = path.resolve(process.cwd(), 'work/conferencia/ui');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const pageDesktop = await contextDesktop.newPage();

  console.log('[CONFERIR-UI] 1. Capturando Banco de Questões (Desktop 1280px)...');
  await pageDesktop.goto('http://localhost:4173/#/?ano=2025&prova=2025-prova1');
  await pageDesktop.waitForSelector('h1');
  await pageDesktop.screenshot({ path: path.join(outDir, '01-banco-desktop-1280.png'), fullPage: false });

  console.log('[CONFERIR-UI] 2. Capturando Questão 32 com alternativa B marcada...');
  await pageDesktop.goto('http://localhost:4173/#/questao/2025-prova1-q032');
  await pageDesktop.waitForSelector('h1');
  const altB = pageDesktop.locator('div[role="radio"]').filter({ hasText: 'B' });
  await altB.click();
  await pageDesktop.screenshot({ path: path.join(outDir, '02-questao-q032-marcada-b.png'), fullPage: false });

  console.log('[CONFERIR-UI] 3. Capturando Resolução da Questão 32 (Feedback e Cartão de Gabarito)...');
  await pageDesktop.click('text=Ver gabarito');
  await pageDesktop.waitForSelector('h1');
  await pageDesktop.screenshot({ path: path.join(outDir, '03-resolucao-q032-feedback.png'), fullPage: false });

  console.log('[CONFERIR-UI] 4. Capturando Pop-up aberto no Desktop via hover...');
  const btnVerQuestao = pageDesktop.locator('button:has-text("Ver questão")');
  await btnVerQuestao.hover();
  await pageDesktop.waitForSelector('div[role="dialog"]');
  await pageDesktop.waitForTimeout(300);
  await pageDesktop.screenshot({ path: path.join(outDir, '04-popup-aberto-desktop.png'), fullPage: false });

  await contextDesktop.close();

  // Mobile Touch Viewport (390 x 844)
  console.log('[CONFERIR-UI] 5. Capturando Mobile (390x844 px)...');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const pageMobile = await contextMobile.newPage();

  await pageMobile.goto('http://localhost:4173/#/');
  await pageMobile.waitForSelector('h1');
  await pageMobile.screenshot({ path: path.join(outDir, '05-mobile-390-banco.png'), fullPage: false });

  console.log('[CONFERIR-UI] 6. Capturando Pop-up em Mobile via Toque com botão Fechar...');
  await pageMobile.goto('http://localhost:4173/#/questao/2025-prova1-q032/resolucao?marcada=B');
  await pageMobile.waitForSelector('h1');
  const btnVerQuestaoMobile = pageMobile.locator('button:has-text("Ver questão")');
  await btnVerQuestaoMobile.tap();
  await pageMobile.waitForSelector('div[role="dialog"]');
  await pageMobile.waitForTimeout(300);
  await pageMobile.screenshot({ path: path.join(outDir, '06-mobile-390-popup-toque.png'), fullPage: false });

  console.log('[CONFERIR-UI] 7. Capturando Discursiva 2021-d04 com rascunho...');
  await pageMobile.goto('http://localhost:4173/#/questao/2021-licenciatura-d04');
  await pageMobile.waitForSelector('h1');
  await pageMobile.screenshot({ path: path.join(outDir, '07-discursiva-d04.png'), fullPage: false });

  await contextMobile.close();
  await browser.close();

  console.log(`[CONFERIR-UI] Todas as 7 capturas foram salvas com sucesso em: ${outDir}`);
}

gerarCapturasUI().catch((err) => {
  console.error('[CONFERIR-UI] Erro ao gerar capturas:', err);
  process.exit(1);
});
