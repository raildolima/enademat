import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartaoGabarito } from '../../src/features/resolucao/CartaoGabarito';
import type { Questao } from '../../src/data/tipos';

describe('CartaoGabarito', () => {
  const questaoMock: Questao = {
    id: '2025-prova1-q032',
    provaId: '2025-prova1',
    tipo: 'objetiva',
    numero: 32,
    rotulo: 'Questão 32',
    parte: 'componente-especifico',
    ordemCaderno: 33,
    paginas: [20],
    enunciado: [{ tipo: 'paragrafo', texto: 'Enunciado de teste' }],
    alternativas: [
      { letra: 'A', blocos: [{ tipo: 'paragrafo', texto: 'Conteúdo da alternativa A' }] },
      { letra: 'B', blocos: [{ tipo: 'paragrafo', texto: 'Conteúdo da alternativa B' }] },
      { letra: 'C', blocos: [{ tipo: 'paragrafo', texto: 'Conteúdo da alternativa C' }] },
      { letra: 'D', blocos: [{ tipo: 'paragrafo', texto: 'Conteúdo da alternativa D (correta)' }] },
    ],
  };

  it('exibe somente o conteúdo da alternativa correta (D)', () => {
    render(<CartaoGabarito questao={questaoMock} gabaritoOficial="D" />);

    expect(screen.getByText('Conteúdo da alternativa D (correta)')).toBeDefined();
    expect(screen.queryByText('Conteúdo da alternativa A')).toBeNull();
    expect(screen.queryByText('Conteúdo da alternativa B')).toBeNull();
    expect(screen.queryByText('Conteúdo da alternativa C')).toBeNull();
  });

  it('exibe feedback positivo quando a alternativa marcada é a correta', () => {
    render(
      <CartaoGabarito
        questao={questaoMock}
        gabaritoOficial="D"
        alternativaMarcada="D"
      />
    );

    const feedback = screen.getByRole('status');
    expect(feedback.textContent).toContain('Você marcou D — correta');
    expect(feedback.textContent).toContain('✓');
  });

  it('exibe feedback de erro quando a alternativa marcada é incorreta', () => {
    render(
      <CartaoGabarito
        questao={questaoMock}
        gabaritoOficial="D"
        alternativaMarcada="B"
      />
    );

    const feedback = screen.getByRole('status');
    expect(feedback.textContent).toContain('Você marcou B — incorreta');
    expect(feedback.textContent).toContain('✗');
  });

  it('exibe título adequado para questão discursiva sem cartão de letras', () => {
    const discursivaMock: Questao = {
      ...questaoMock,
      tipo: 'discursiva',
      alternativas: undefined,
    };

    render(<CartaoGabarito questao={discursivaMock} gabaritoOficial="***" />);
    expect(screen.getByText('Padrão de Resposta Esperado')).toBeDefined();
    expect(screen.queryByText(/Gabarito oficial/i)).toBeNull();
  });
});
