import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { IndiceProvas, ProvaCompleta, Questao, Letra } from '../../src/data/tipos';

// Dados mínimos de duas questões consecutivas da mesma prova.
function criarQuestao(numero: number): Questao {
  const n = String(numero).padStart(3, '0');
  return {
    id: `2025-prova1-q${n}`,
    provaId: '2025-prova1',
    tipo: 'objetiva',
    numero,
    rotulo: `Questão ${numero}`,
    parte: 'componente-especifico',
    ordemCaderno: numero + 1,
    paginas: [20],
    enunciado: [{ tipo: 'paragrafo', texto: `Enunciado da questão ${numero}.` }],
    alternativas: (['A', 'B', 'C', 'D'] as Letra[]).map((letra) => ({
      letra,
      blocos: [{ tipo: 'paragrafo' as const, texto: `Alternativa ${letra} da questão ${numero}` }],
    })),
  };
}

const q032 = criarQuestao(32);
const q033 = criarQuestao(33);

const provaCompleta: ProvaCompleta = {
  prova: {
    id: '2025-prova1',
    ano: 2025,
    ordem: 2,
    titulo: 'ENADE 2025 · Matemática (Licenciatura) · Prova 1',
    subtitulo: '1ª aplicação',
    arquivoProva: 'prova.pdf',
    arquivoGabarito: 'gabarito.pdf',
    alternativasPorQuestao: 4,
    linhasDiscursiva: 30,
  },
  gabarito: { provaId: '2025-prova1', fonte: 'gabarito.pdf', objetivas: { '32': 'D', '33': 'A' }, discursivas: ['D1'] },
  textosBase: {},
  questoes: [q032, q033],
  resolucoes: {},
};

const indice: IndiceProvas = {
  provas: [provaCompleta.prova],
  questoes: [q032, q033].map((q) => ({
    id: q.id,
    provaId: q.provaId,
    tipo: q.tipo,
    numero: q.numero,
    rotulo: q.rotulo,
    parte: q.parte,
    ordemCaderno: q.ordemCaderno,
    previa: '',
  })),
};

vi.mock('../../src/data/carregar', () => ({
  carregarIndice: async () => indice,
  carregarProva: async () => provaCompleta,
  carregarQuestao: async (id: string) => {
    const questao = provaCompleta.questoes.find((q) => q.id === id);
    if (!questao) throw new Error('não encontrada');
    return { questao, prova: provaCompleta };
  },
}));

const { Layout } = await import('../../src/app/Layout');
const { PaginaQuestao } = await import('../../src/features/questao/PaginaQuestao');
const { ConteudoQuestao } = await import('../../src/components/ConteudoQuestao');
const { Blocos } = await import('../../src/components/Blocos');

function renderizarApp(url: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <p>Banco</p> },
          { path: 'questao/:questaoId', element: <PaginaQuestao /> },
        ],
      },
    ],
    { initialEntries: [url] }
  );
  render(<RouterProvider router={router} />);
  return router;
}

function radios(): HTMLElement[] {
  return screen.getAllByRole('radio');
}

beforeEach(() => cleanup());

describe('CR-01 — skip-link', () => {
  it('move o foco para o conteúdo principal sem navegar para outra rota', () => {
    const router = renderizarApp('/');
    const link = screen.getByText('Pular para o conteúdo principal');
    const naoCancelado = fireEvent.click(link);
    expect(naoCancelado).toBe(false);
    expect(document.activeElement).toBe(document.getElementById('conteudo-principal'));
    expect(router.state.location.pathname).toBe('/');
  });
});

describe('CR-02 — marcação preservada ao voltar da resolução', () => {
  it('restaura a alternativa indicada em ?marcada=', async () => {
    renderizarApp('/questao/2025-prova1-q032?marcada=B');
    await screen.findByText('Enunciado da questão 32.');
    expect(radios().map((r) => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false', 'false']);
  });

  it('ignora ?marcada= com letra inexistente na questão', async () => {
    renderizarApp('/questao/2025-prova1-q032?marcada=Z');
    await screen.findByText('Enunciado da questão 32.');
    expect(radios().every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('não propaga ?marcada= para a próxima questão', async () => {
    renderizarApp('/questao/2025-prova1-q032?marcada=B&ano=2025');
    await screen.findByText('Enunciado da questão 32.');
    const proxima = screen.getByRole('link', { name: /próxima/i });
    const destino = proxima.getAttribute('href') ?? '';
    expect(destino).toContain('2025-prova1-q033');
    expect(destino).toContain('ano=2025');
    expect(destino).not.toContain('marcada');
  });
});

describe('CR-07 — radiogroup com setas e roving tabindex', () => {
  function renderizarAlternativas(marcada: Letra | null, onSelecionar = vi.fn()) {
    render(<ConteudoQuestao questao={q032} alternativaMarcada={marcada} onSelecionarAlternativa={onSelecionar} />);
    return onSelecionar;
  }

  it('sem marcação, só a primeira alternativa entra na ordem de Tab', () => {
    renderizarAlternativas(null);
    expect(radios().map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
  });

  it('com marcação, só a alternativa marcada entra na ordem de Tab', () => {
    renderizarAlternativas('C');
    expect(radios().map((r) => r.tabIndex)).toEqual([-1, -1, 0, -1]);
  });

  it('ArrowDown move o foco e marca a próxima alternativa', () => {
    const onSelecionar = renderizarAlternativas('A');
    const [a, b] = radios();
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(b);
    expect(onSelecionar).toHaveBeenCalledWith('B');
  });

  it('ArrowUp na primeira alternativa volta para a última', () => {
    const onSelecionar = renderizarAlternativas('A');
    const lista = radios();
    lista[0].focus();
    fireEvent.keyDown(lista[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(lista[3]);
    expect(onSelecionar).toHaveBeenCalledWith('D');
  });

  it('ArrowRight e ArrowLeft também navegam', () => {
    const onSelecionar = renderizarAlternativas('B');
    const lista = radios();
    lista[1].focus();
    fireEvent.keyDown(lista[1], { key: 'ArrowRight' });
    expect(onSelecionar).toHaveBeenLastCalledWith('C');
    fireEvent.keyDown(lista[2], { key: 'ArrowLeft' });
    expect(onSelecionar).toHaveBeenLastCalledWith('B');
  });
});

describe('CR-08 — conectivo de asserção-razão', () => {
  it('"PORQUE" fica exposto para leitores de tela', () => {
    render(<Blocos blocos={[{ tipo: 'conectivo', texto: 'PORQUE' }]} />);
    expect(screen.getByText('PORQUE').closest('[aria-hidden="true"]')).toBeNull();
  });
});
