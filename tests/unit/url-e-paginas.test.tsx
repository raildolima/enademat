import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { IndiceProvas, ProvaCompleta, Questao, Letra } from '../../src/data/tipos';

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
const discursiva: Questao = {
  id: '2025-prova1-d01',
  provaId: '2025-prova1',
  tipo: 'discursiva',
  numero: 1,
  rotulo: 'Discursiva 1',
  parte: 'formacao-geral',
  ordemCaderno: 1,
  paginas: [10],
  enunciado: [{ tipo: 'paragrafo', texto: 'Enunciado discursivo.' }],
};

const provaCompleta: ProvaCompleta = {
  prova: {
    id: '2025-prova1',
    ano: 2025,
    ordem: 2,
    titulo: 'ENADE 2025 · Prova 1',
    subtitulo: '1ª aplicação',
    arquivoProva: 'prova.pdf',
    arquivoGabarito: 'gabarito.pdf',
    alternativasPorQuestao: 4,
    linhasDiscursiva: 30,
  },
  gabarito: { provaId: '2025-prova1', fonte: 'gabarito.pdf', objetivas: { '32': 'D', '33': 'A' }, discursivas: ['D1'] },
  textosBase: {},
  questoes: [discursiva, q032, q033],
  resolucoes: {},
};

const indice: IndiceProvas = {
  provas: [provaCompleta.prova],
  questoes: provaCompleta.questoes.map((q) => ({
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

// Carregamento controlável por teste: cada id pode ficar pendente até ser liberado.
const pendentes = new Map<string, () => void>();
let atrasar = false;

vi.mock('../../src/data/carregar', () => ({
  carregarIndice: async () => indice,
  carregarProva: async () => provaCompleta,
  carregarQuestao: (id: string) => {
    const questao = provaCompleta.questoes.find((q) => q.id === id);
    if (!questao) return Promise.reject(new Error('não encontrada'));
    const dados = { questao, prova: provaCompleta };
    if (!atrasar) return Promise.resolve(dados);
    return new Promise((resolve) => pendentes.set(id, () => resolve(dados)));
  },
}));

const { lerFiltrosDaUrl, lerLetraMarcada } = await import('../../src/data/url');
const { PaginaQuestao } = await import('../../src/features/questao/PaginaQuestao');
const { PaginaResolucao } = await import('../../src/features/resolucao/PaginaResolucao');
const { Filtros } = await import('../../src/features/banco/Filtros');
const { CartaoGabarito } = await import('../../src/features/resolucao/CartaoGabarito');

function renderizar(url: string) {
  const router = createMemoryRouter(
    [
      { path: '/questao/:questaoId', element: <PaginaQuestao /> },
      { path: '/questao/:questaoId/resolucao', element: <PaginaResolucao /> },
    ],
    { initialEntries: [url] }
  );
  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => {
  cleanup();
  pendentes.clear();
  atrasar = false;
});

describe('CR-06 — lerFiltrosDaUrl', () => {
  it('descarta valores desconhecidos', () => {
    const filtros = lerFiltrosDaUrl(new URLSearchParams('ano=abc&prova=2025-prova9&parte=x&tipo=y&termo=matriz'));
    expect(filtros).toEqual({ ano: 'todos', provaId: 'todas', parte: 'todas', tipo: 'todas', termo: 'matriz' });
  });

  it('aceita valores válidos, inclusive o parâmetro legado provaId', () => {
    const filtros = lerFiltrosDaUrl(new URLSearchParams('ano=2025&provaId=2025-prova5&parte=formacao-geral&tipo=discursiva'));
    expect(filtros).toEqual({ ano: 2025, provaId: '2025-prova5', parte: 'formacao-geral', tipo: 'discursiva', termo: '' });
  });

  it('descarta prova incompatível com o ano', () => {
    const filtros = lerFiltrosDaUrl(new URLSearchParams('ano=2021&prova=2025-prova1'));
    expect(filtros.ano).toBe(2021);
    expect(filtros.provaId).toBe('todas');
  });
});

describe('CR-04 — lerLetraMarcada', () => {
  it('aceita só letras existentes na questão', () => {
    expect(lerLetraMarcada(new URLSearchParams('marcada=B'), q032)).toBe('B');
    expect(lerLetraMarcada(new URLSearchParams('marcada=E'), q032)).toBeNull();
    expect(lerLetraMarcada(new URLSearchParams('marcada=Z'), q032)).toBeNull();
    expect(lerLetraMarcada(new URLSearchParams('marcada=A'), discursiva)).toBeNull();
  });

  it('a resolução não mostra feedback para letra inexistente', async () => {
    renderizar('/questao/2025-prova1-q032/resolucao?marcada=Z');
    await screen.findByRole('heading', { level: 1, name: 'Resolução · Questão 32' });
    expect(screen.queryByText(/Você marcou/)).toBeNull();
  });
});

describe('CR-05 — resposta antiga não sobrescreve a questão atual', () => {
  it('mostra a questão navegada por último mesmo que a anterior termine de carregar depois', async () => {
    atrasar = true;
    const router = renderizar('/questao/2025-prova1-q032');
    await act(async () => {
      await router.navigate('/questao/2025-prova1-q033');
    });
    await act(async () => {
      pendentes.get('2025-prova1-q033')?.();
    });
    await act(async () => {
      pendentes.get('2025-prova1-q032')?.();
    });
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Questão 33');
  });
});

describe('CR-12 — contagem de resultados anunciada', () => {
  it('a contagem fica numa região role="status"', () => {
    render(<Filtros filtros={{}} onChangeFiltros={() => {}} totalQuestoes={81} />);
    expect(screen.getByRole('status')).toHaveTextContent('81 questões encontradas');
  });
});

describe('CR-13 — textos da especificação', () => {
  it('objetiva mostra "Gabarito: D"', () => {
    render(<CartaoGabarito questao={q032} gabaritoOficial="D" />);
    expect(screen.getByText(/^Gabarito:/)).toHaveTextContent('Gabarito: D');
  });

  it('discursiva usa o título "Resposta esperada"', () => {
    render(<CartaoGabarito questao={discursiva} gabaritoOficial={null} />);
    expect(screen.getByRole('heading', { name: 'Resposta esperada' })).toBeDefined();
  });

  it('resolução ausente não cita a Fase 6 nem pula nível de título', async () => {
    renderizar('/questao/2025-prova1-q033/resolucao');
    await screen.findByRole('heading', { level: 1, name: 'Resolução · Questão 33' });
    expect(screen.queryByText(/Fase 6/)).toBeNull();
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });
});
