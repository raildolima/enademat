import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Markdown } from '../../src/components/Markdown';

describe('CR-33 — Markdown e o escape de cifrão', () => {
  it('code span mantém o texto literal', () => {
    const { container } = render(<Markdown conteudo={'Escreva `R\\$` no enunciado.'} />);
    expect(container.querySelector('code')?.textContent).toBe('R\\$');
  });

  it('R\\$ fora de fórmula vira R$ e não abre fórmula', () => {
    const { container } = render(<Markdown conteudo={'O kit custa R\\$ 25{,}00 e o frete R\\$ 7{,}00.'} />);
    expect(container.textContent).toContain('R$ 25{,}00 e o frete R$ 7{,}00.');
    expect(container.querySelector('.katex')).toBeNull();
  });

  // O conteúdo usa R\$ dentro de fórmula só em display ($$…$$): em fórmula inline o remark-math
  // fecha a fórmula no cifrão de \text{R\$ }, limitação do próprio plugin.
  it('fórmulas continuam renderizando, inclusive com R\\$ dentro de \\text em display', () => {
    const { container } = render(<Markdown conteudo={'Total:\n\n$$\\text{R\\$ } 400{,}00$$\n\ne $x^2$.'} />);
    expect(container.querySelectorAll('.katex').length).toBe(2);
    expect(container.querySelector('.katex-error')).toBeNull();
  });
});
