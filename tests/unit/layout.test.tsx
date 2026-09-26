import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { Layout } from '../../src/app/Layout';

function renderizarLayout() {
  const router = createMemoryRouter([{ path: '/', element: <Layout />, children: [{ index: true, element: <p>conteúdo</p> }] }]);
  return render(<RouterProvider router={router} />);
}

describe('Layout com identidade UFMS', () => {
  it('cabeçalho traz a assinatura da UFMS com alt e dimensões explícitas', () => {
    renderizarLayout();
    const logo = within(screen.getByRole('banner')).getByRole('img', { name: 'UFMS — Universidade Federal de Mato Grosso do Sul' });
    expect(logo.getAttribute('width')).toMatch(/^\d+$/);
    expect(logo.getAttribute('height')).toMatch(/^\d+$/);
    expect(logo.getAttribute('src')).toMatch(/marca\/ufms-assinatura-horizontal-.+\.webp$/);
  });

  it('link inicial mantém o rótulo e o título do simulador', () => {
    renderizarLayout();
    const link = screen.getByRole('link', { name: 'Ir para página inicial do Simulador ENADE' });
    expect(link.textContent).toContain('Simulador ENADE');
  });

  it('rodapé preserva o aviso RF09 literal e traz a assinatura da UFMS', () => {
    renderizarLayout();
    const rodape = screen.getByRole('contentinfo');
    expect(rodape.textContent).toContain(
      'Questões: INEP/MEC — ENADE 2021 e 2025. Resoluções elaboradas para fins educacionais.'
    );
    expect(rodape.textContent).toContain('Site não oficial.');
    expect(within(rodape).getByRole('img', { name: 'UFMS — Universidade Federal de Mato Grosso do Sul' })).toBeTruthy();
  });

  it('não usa emoji como ícone no cabeçalho', () => {
    renderizarLayout();
    expect(screen.getByRole('banner').textContent).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
