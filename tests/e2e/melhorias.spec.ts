import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// RF10, RF11 e RF15 (melhorias aprovadas em 2026-10-22).
const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function violacoesGraves(page: Page) {
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();
  return resultado.violations
    .filter((v) => v.impact === 'critical' || v.impact === 'serious')
    .map((v) => ({ id: v.id, alvos: v.nodes.map((n) => n.target.join(' ')) }));
}

test.describe('Dica progressiva (RF10)', () => {
  test('mostra a Ideia-chave sem revelar o gabarito', async ({ page }) => {
    await page.goto('/#/questao/2026-prova1-q053');
    const botao = page.getByRole('button', { name: 'Ver dica' });
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await botao.click();
    const dica = page.getByRole('region', { name: 'Dica' });
    await expect(dica.locator('.katex, p').first()).toBeVisible();
    await expect(dica).not.toContainText(/alternativa [A-D]\b|gabarito/i);
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test('discursivas não têm dica', async ({ page }) => {
    await page.goto('/#/questao/2026-prova1-d01');
    await expect(page.locator('h1')).toHaveText('Questão Discursiva 1');
    await expect(page.getByRole('button', { name: 'Ver dica' })).toHaveCount(0);
  });
});

test.describe('Página da prova (RF11)', () => {
  test('grade numerada leva à questão dentro do filtro da prova', async ({ page }) => {
    await page.goto('/#/prova/2026-prova1');
    await expect(page.locator('h1')).toHaveText(/ENADE 2026/);
    await expect(page.getByRole('link', { name: /^Questão \d+$|^Questão Discursiva 1$/ })).toHaveCount(81);
    await page.getByRole('link', { name: 'Questão 47', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('Questão 47');
    await expect(page).toHaveURL(/prova=2026-prova1/);
  });

  test('o banco tem link para a página de cada prova', async ({ page }) => {
    await page.goto('/#/?ano=2026&prova=2026-prova1');
    await page.getByRole('link', { name: 'Ver a prova completa (grade de questões)' }).click();
    await expect(page).toHaveURL(/#\/prova\/2026-prova1$/);
  });

  test('prova inexistente mostra aviso', async ({ page }) => {
    await page.goto('/#/prova/2099-prova9');
    await expect(page.locator('h1')).toHaveText('Prova não encontrada');
  });
});

test.describe('Modo simulado (RF15)', () => {
  test('treino: marcar, conferir e ver o cartão do gabarito', async ({ page }) => {
    await page.goto('/#/simulado/2026-prova1');
    await page.getByRole('button', { name: 'Começar' }).click();
    await expect(page).toHaveURL(/modo=treino/);
    await expect(page.getByRole('button', { name: 'Conferir resposta' })).toBeDisabled();
    await page.getByRole('radio').first().click();
    await expect(page).toHaveURL(/r=A/);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await expect(page.getByRole('region', { name: 'Gabarito oficial' })).toContainText('Gabarito: A');
    await expect(page.getByText('Você marcou A — correta')).toBeVisible();
  });

  test('prova: respostas na URL, finalização com confirmação e resultado por parte', async ({ page }) => {
    // Q1 = A (correta), Q2 = A (errada; gabarito D), demais em branco
    await page.goto('/#/simulado/2026-prova1?modo=prova&q=1&r=AA');
    await expect(page.getByRole('button', { name: 'Questão 1, marcada A' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Conferir resposta' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Finalizar simulado' }).click();
    await expect(page.getByText('Você deixou 78 questões em branco. Finalizar mesmo assim?')).toBeVisible();
    await page.getByRole('button', { name: 'Sim, ver resultado' }).click();
    await expect(page.locator('h1')).toHaveText('Resultado do simulado');
    await expect(page.getByText('1 de 80 questões objetivas corretas')).toBeVisible();
    const linhaFg = page.getByRole('row', { name: /Formação Geral/ });
    await expect(linhaFg).toContainText('1 de 30');
    await page.getByRole('link', { name: 'Questão 2', exact: true }).click();
    await expect(page).toHaveURL(/questao\/2026-prova1-q002\/resolucao\?marcada=A/);
  });

  test('cronômetro aparece só no modo prova quando escolhido', async ({ page }) => {
    await page.goto('/#/simulado/2026-prova1?modo=prova&crono=1&q=1');
    await expect(page.getByRole('timer')).toBeVisible();
    await page.getByRole('button', { name: 'Pausar' }).click();
    await expect(page.getByRole('button', { name: 'Retomar' })).toBeVisible();
  });
});

test.describe('Desempenho nacional (RF16)', () => {
  test('mostra o índice de acerto e a distribuição por alternativa', async ({ page }) => {
    await page.goto('/#/questao/2021-licenciatura-q001/resolucao');
    const secao = page.getByRole('region', { name: 'Desempenho nacional no ENADE 2021' });
    await expect(secao).toContainText('36,2% dos 13.824 estudantes');
    await expect(secao.getByRole('listitem').filter({ hasText: '(gabarito)' })).toContainText('E');
    await expect(secao).toContainText('Fonte: INEP');
  });

  test('questão anulada no gabarito final do INEP é sinalizada', async ({ page }) => {
    await page.goto('/#/questao/2021-licenciatura-q009/resolucao');
    await expect(page.getByRole('region', { name: 'Desempenho nacional no ENADE 2021' })).toContainText('anulada');
  });

  test('prova sem microdados não mostra a seção', async ({ page }) => {
    await page.goto('/#/questao/2026-prova1-q053/resolucao');
    await expect(page.locator('h1')).toHaveText('Resolução · Questão 53');
    await expect(page.getByRole('region', { name: /Desempenho nacional/ })).toHaveCount(0);
  });
});

test.describe('Assuntos (RF14)', () => {
  test('filtro por assunto vai para a URL e reduz a lista', async ({ page }) => {
    await page.goto('/#/');
    await page.selectOption('#filtro-assunto', 'algebra-linear');
    await expect(page).toHaveURL(/assunto=algebra-linear/);
    const contador = page.getByRole('status');
    await expect(contador).not.toContainText('283');
    const cards = page.locator('a[href*="/questao/"]');
    await expect(cards.first()).toContainText('Álgebra Linear e Matrizes');
    expect(await cards.count()).toBeLessThan(20);
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(contador).toContainText('283 questões encontradas');
  });

  test('resolução lista questões relacionadas pelo assunto principal', async ({ page }) => {
    await page.goto('/#/questao/2026-prova1-q066/resolucao');
    const secao = page.getByRole('region', { name: 'Questões relacionadas' });
    await expect(secao).toBeVisible();
    await expect(secao.getByRole('link').first()).toHaveAttribute('href', /#\/questao\/.+\?assunto=/);
  });
});

test.describe('Relatar erro (RF12)', () => {
  test('abre issue do GitHub preenchida com a questão, em nova aba', async ({ page }) => {
    await page.goto('/#/questao/2026-prova1-q053');
    const link = page.getByRole('link', { name: /Relatar erro nesta questão/ });
    await expect(link).toHaveAttribute('target', '_blank');
    const href = await link.getAttribute('href');
    expect(href).toContain('https://github.com/raildolima/enademat/issues/new?title=');
    expect(decodeURIComponent(href!)).toContain('2026-prova1-q053');
  });
});

for (const esquema of ['light', 'dark'] as const) {
  test.describe(`Acessibilidade das novas telas — tema ${esquema}`, () => {
    test.use({ colorScheme: esquema });

    const telas = [
      { nome: 'página da prova', url: '/#/prova/2026-prova1', h1: /ENADE 2026/ },
      { nome: 'início do simulado', url: '/#/simulado/2026-prova1', h1: /Simulado/ },
      { nome: 'questão do simulado', url: '/#/simulado/2026-prova1?modo=prova&crono=1&q=5&r=AB', h1: /Simulado/ },
      { nome: 'resultado do simulado', url: '/#/simulado/2026-prova1?modo=prova&fim=1&r=AB', h1: 'Resultado do simulado' },
      { nome: 'resolução com desempenho nacional', url: '/#/questao/2025-prova1-q015/resolucao', h1: 'Resolução · Questão 15' },
    ];
    for (const tela of telas) {
      test(`${tela.nome} sem violações graves`, async ({ page }) => {
        await page.goto(tela.url);
        await expect(page.locator('h1')).toHaveText(tela.h1);
        expect(await violacoesGraves(page)).toEqual([]);
      });
    }

    test('dica aberta sem violações graves', async ({ page }) => {
      await page.goto('/#/questao/2026-prova1-q053');
      await page.getByRole('button', { name: 'Ver dica' }).click();
      await expect(page.getByRole('button', { name: 'Ocultar dica' })).toBeVisible();
      expect(await violacoesGraves(page)).toEqual([]);
    });
  });
}
