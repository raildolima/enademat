import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { extrairCorpoMarkdown, extrairSecao } from '../../src/data/resolucao';
import { DicaQuestao } from '../../src/features/questao/DicaQuestao';

const resolucao = `---
questaoId: 2026-prova1-q053
respostaIndependente: B
respostaFinal: B
verificacao: aprovada
revisaoHumana: false
---

## Ideia-chave
O tempo de ida e volta do som é o dobro da distância dividido pela velocidade.

## Resolução passo a passo
**Conclusão:** alternativa **B**.
`;

describe('RF10 — dica a partir da Ideia-chave', () => {
  it('extrai só a seção pedida, sem frontmatter nem a seção seguinte', () => {
    const dica = extrairSecao(extrairCorpoMarkdown(resolucao), 'Ideia-chave');
    expect(dica).toBe('O tempo de ida e volta do som é o dobro da distância dividido pela velocidade.');
  });

  it('devolve null quando a seção não existe', () => {
    expect(extrairSecao('## Outra\ntexto', 'Ideia-chave')).toBeNull();
  });

  it('o botão alterna a dica e informa o estado por aria-expanded', async () => {
    render(<DicaQuestao dica="Use o dobro da distância." />);
    const botao = screen.getByRole('button', { name: 'Ver dica' });
    expect(botao).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(botao);
    expect(screen.getByRole('button', { name: 'Ocultar dica' })).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('Use o dobro da distância.')).toBeVisible();
  });
});
