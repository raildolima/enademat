import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NavegacaoQuestao } from '../../src/features/questao/NavegacaoQuestao';

function renderizar(posicaoAtual: number, totalFiltrado: number) {
  return render(
    <MemoryRouter>
      <NavegacaoQuestao
        questaoId="2025-prova1-q033"
        tipo="objetiva"
        alternativaMarcada={null}
        anterior={null}
        proxima={null}
        posicaoAtual={posicaoAtual}
        totalFiltrado={totalFiltrado}
        queryStringParams=""
      />
    </MemoryRouter>
  );
}

describe('NavegacaoQuestao — barra de progresso', () => {
  it('mantém o texto "Questão X de Y" e desenha a barra proporcional, oculta dos leitores de tela', () => {
    const { container } = renderizar(3, 12);
    expect(screen.getByText(/Questão/).textContent).toBe('Questão 3 de 12');
    const barra = container.querySelector('[data-testid="barra-progresso"]');
    expect(barra).not.toBeNull();
    expect(barra!.getAttribute('aria-hidden')).toBe('true');
    const preenchimento = barra!.firstElementChild as HTMLElement;
    expect(preenchimento.style.width).toBe('25%');
  });

  it('não desenha barra quando a questão não está na lista filtrada', () => {
    const { container } = renderizar(0, 12);
    expect(container.querySelector('[data-testid="barra-progresso"]')).toBeNull();
  });

  it('usa ícones SVG em vez de caracteres ‹ › ← nos links', () => {
    renderizar(3, 12);
    for (const nome of [/voltar ao banco/i, /anterior/i, /próxima/i]) {
      const link = screen.getByRole('link', { name: nome });
      expect(link.textContent).not.toMatch(/[‹›←]/);
      expect(link.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    }
  });
});
