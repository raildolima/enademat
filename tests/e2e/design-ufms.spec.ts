import { test, expect, type Page } from '@playwright/test';

// Identidade visual UFMS (docs/DESIGN-UFMS.md): logo oficial, fontes empacotadas, sem emoji como ícone e layout sem rolagem horizontal.
const PAGINAS = [
  { nome: 'Banco', url: '/#/', pronta: (p: Page) => expect(p.getByRole('status')).toBeVisible() },
  { nome: 'Questão', url: '/#/questao/2025-prova1-q032', pronta: (p: Page) => expect(p.locator('h1')).toHaveText('Questão 32') },
  {
    nome: 'Resolução',
    url: '/#/questao/2025-prova1-q032/resolucao?marcada=B',
    pronta: (p: Page) => expect(p.locator('h1')).toHaveText('Resolução · Questão 32'),
  },
  {
    // Fonte do INEP com URL longa (RF16): não pode alargar a página no celular
    nome: 'Resolução com desempenho nacional',
    url: '/#/questao/2025-prova1-q032/resolucao',
    pronta: (p: Page) => expect(p.getByRole('region', { name: 'Desempenho nacional no ENADE 2025' })).toBeVisible(),
  },
  { nome: 'Prova', url: '/#/prova/2026-prova1', pronta: (p: Page) => expect(p.locator('h1')).toHaveText(/ENADE 2026/) },
  {
    nome: 'Simulado',
    url: '/#/simulado/2026-prova1?modo=prova&crono=1&q=47',
    pronta: (p: Page) => expect(p.getByRole('timer')).toBeVisible(),
  },
];

const ALT_LOGO = 'UFMS — Universidade Federal de Mato Grosso do Sul';
const EMOJI = /\p{Extended_Pictographic}/u;

test.describe('Design System UFMS', () => {
  test('cabeçalho e rodapé exibem a assinatura da UFMS carregada, sem distorção', async ({ page }) => {
    await page.goto('/#/');
    for (const regiao of [page.getByRole('banner'), page.getByRole('contentinfo')]) {
      const logo = regiao.getByRole('img', { name: ALT_LOGO });
      await expect(logo).toBeVisible();
      const medidas = await logo.evaluate((img: HTMLImageElement) => ({
        natural: img.naturalWidth / img.naturalHeight,
        exibida: img.getBoundingClientRect().width / img.getBoundingClientRect().height,
        largura: img.getAttribute('width'),
        altura: img.getAttribute('height'),
      }));
      expect(medidas.largura).not.toBeNull();
      expect(medidas.altura).not.toBeNull();
      expect(Math.abs(medidas.exibida - medidas.natural)).toBeLessThan(0.02);
    }
  });

  test('fontes Poppins (títulos) e Inter (texto) são carregadas do próprio build', async ({ page }) => {
    const externas: string[] = [];
    const fontesLocais: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (!['localhost', '127.0.0.1'].includes(url.hostname)) externas.push(req.url());
      else if (url.pathname.endsWith('.woff2')) fontesLocais.push(url.pathname);
    });
    await page.goto('/#/');
    await expect(page.getByRole('status')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const familias = await page.evaluate(() => ({
      titulo: getComputedStyle(document.querySelector('h1')!).fontFamily,
      corpo: getComputedStyle(document.body).fontFamily,
      // document.fonts.check() devolve true quando nenhuma @font-face casa (fonte do sistema); exige a face carregada.
      carregadas: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')),
    }));
    expect(familias.titulo).toMatch(/^"?Poppins/);
    expect(familias.corpo).toMatch(/^"?Inter/);
    expect(familias.carregadas).toEqual(expect.arrayContaining(['Poppins', 'Inter']));
    expect(fontesLocais.some((f) => /poppins/i.test(f))).toBe(true);
    expect(fontesLocais.some((f) => /inter/i.test(f))).toBe(true);
    expect(externas).toEqual([]);
  });

  for (const pagina of PAGINAS) {
    test(`${pagina.nome}: cabeçalho, navegação e rodapé não usam emoji como ícone`, async ({ page }) => {
      await page.goto(pagina.url);
      await pagina.pronta(page);
      const textos = await page.locator('header, nav, footer, button').allTextContents();
      expect(textos.filter((t) => EMOJI.test(t))).toEqual([]);
    });

    test(`${pagina.nome}: sem rolagem horizontal a 360 px`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(pagina.url);
      await pagina.pronta(page);
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(excesso).toBeLessThanOrEqual(0);
    });
  }
});
