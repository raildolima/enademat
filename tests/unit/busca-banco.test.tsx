import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { IndiceProvas } from '../../src/data/tipos';

const indice: IndiceProvas = {
  provas: [
    {
      id: '2025-prova5',
      ano: 2025,
      ordem: 3,
      titulo: 'ENADE 2025 · Matemática (Licenciatura) · Prova 5',
      subtitulo: '2ª aplicação',
      arquivoProva: 'prova.pdf',
      arquivoGabarito: 'gabarito.pdf',
      alternativasPorQuestao: 4,
      linhasDiscursiva: 30,
    },
  ],
  questoes: [
    {
      id: '2025-prova5-q066',
      provaId: '2025-prova5',
      tipo: 'objetiva',
      numero: 66,
      rotulo: 'Questão 66',
      parte: 'componente-especifico',
      ordemCaderno: 67,
      previa: 'Considere a matriz inversa de A.',
    },
    {
      id: '2025-prova5-q067',
      provaId: '2025-prova5',
      tipo: 'objetiva',
      numero: 67,
      rotulo: 'Questão 67',
      parte: 'componente-especifico',
      ordemCaderno: 68,
      previa: 'A matriz identidade é inversa de si mesma? Não: aqui só há matriz e inversa separadas.',
    },
  ],
};

vi.mock('../../src/data/carregar', () => ({
  carregarIndice: async () => indice,
}));

const { PaginaBanco } = await import('../../src/features/banco/PaginaBanco');

function renderizarBanco() {
  const router = createMemoryRouter([{ path: '/', element: <PaginaBanco /> }], { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('CR-03 — busca por termo no banco', () => {
  it('preserva os espaços enquanto se digita um termo com mais de uma palavra', async () => {
    renderizarBanco();
    const campo = await screen.findByLabelText('Buscar por termo, fórmula ou número');
    await userEvent.type(campo, 'matriz inversa');
    expect((campo as HTMLInputElement).value).toBe('matriz inversa');
  });

  it('filtra pelo termo completo com espaço', async () => {
    const router = renderizarBanco();
    const campo = await screen.findByLabelText('Buscar por termo, fórmula ou número');
    await userEvent.type(campo, 'matriz inversa');
    expect(screen.getByText(/questão encontrada/)).toBeDefined();
    expect(new URLSearchParams(router.state.location.search).get('termo')).toBe('matriz inversa');
  });
});
