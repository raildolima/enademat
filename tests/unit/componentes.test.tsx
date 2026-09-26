import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextoRico } from '../../src/components/TextoRico';
import { Blocos } from '../../src/components/Blocos';
import { ConteudoQuestao } from '../../src/components/ConteudoQuestao';
import { Questao } from '../../src/data/tipos';

describe('Componentes Base de Renderização', () => {
  it('TextoRico renderiza KaTeX inline e converte R\\$ para R$', () => {
    const { container } = render(
      <TextoRico texto="O valor é R\$ 150{,}00 e a função é $f(x) = x^2$." />
    );

    // Deve conter classe do KaTeX
    expect(container.querySelector('.katex')).not.toBeNull();
    // Deve conter R$ 150 sem barra invertida
    expect(container.textContent).toContain('R$ 150{,}00');
    expect(container.textContent).not.toContain('R\\$');
  });

  it('Blocos renderiza múltiplos tipos estruturados (paragrafo, formula, afirmativas)', () => {
    const blocosTeste = [
      { tipo: 'titulo' as const, texto: 'Título de Teste' },
      { tipo: 'paragrafo' as const, texto: 'Primeiro parágrafo explicativo.' },
      { tipo: 'formula' as const, latex: 'E = mc^2' },
      {
        tipo: 'afirmativas' as const,
        itens: [
          { rotulo: 'I' as const, texto: 'Primeira afirmativa.' },
          { rotulo: 'II' as const, texto: 'Segunda afirmativa.' },
        ],
      },
      { tipo: 'conectivo' as const, texto: 'PORQUE' as const },
    ];

    const { container } = render(<Blocos blocos={blocosTeste} />);

    expect(screen.getByText('Título de Teste')).toBeDefined();
    expect(screen.getByText('Primeiro parágrafo explicativo.')).toBeDefined();
    expect(screen.getByText('I')).toBeDefined();
    expect(screen.getByText('II')).toBeDefined();
    expect(screen.getByText('PORQUE')).toBeDefined();
    expect(container.querySelector('.katex')).not.toBeNull();
  });

  it('ConteudoQuestao renderiza alternativas e lida com clique e desmarcação', () => {
    const questaoMock: Questao = {
      id: '2025-prova1-q001',
      provaId: '2025-prova1',
      tipo: 'objetiva',
      numero: 1,
      rotulo: 'Questão 01',
      parte: 'formacao-geral',
      ordemCaderno: 1,
      paginas: [2],
      enunciado: [{ tipo: 'paragrafo', texto: 'Enunciado de teste.' }],
      alternativas: [
        { letra: 'A', blocos: [{ tipo: 'paragrafo', texto: 'Alternativa A' }] },
        { letra: 'B', blocos: [{ tipo: 'paragrafo', texto: 'Alternativa B' }] },
      ],
    };

    const onSelecionar = vi.fn();
    const { rerender } = render(
      <ConteudoQuestao
        questao={questaoMock}
        alternativaMarcada={null}
        onSelecionarAlternativa={onSelecionar}
      />
    );

    expect(screen.getByText('Enunciado de teste.')).toBeDefined();
    const altA = screen.getByText('Alternativa A');
    fireEvent.click(altA);
    expect(onSelecionar).toHaveBeenCalledWith('A');

    // Quando já está marcada como A e clica em A, desmarca (chama null)
    rerender(
      <ConteudoQuestao
        questao={questaoMock}
        alternativaMarcada="A"
        onSelecionarAlternativa={onSelecionar}
      />
    );
    fireEvent.click(altA);
    expect(onSelecionar).toHaveBeenCalledWith(null);
  });
});
