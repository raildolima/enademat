import React from 'react';
import katex from 'katex';

interface TextoRicoProps {
  texto: string;
  className?: string;
}

const MARCADO_REAL = '\uE000';
const MARCADO_DOLAR = '\uE001';

/**
 * Renderiza texto enriquecido com suporte a:
 * - Fórmulas LaTeX inline: $...$
 * - Fórmulas LaTeX display: $$...$$
 * - Formatação Markdown inline: **negrito** e *itálico*
 * - Escape de moeda brasileira: R\$ -> R$
 */
export const TextoRico: React.FC<TextoRicoProps> = ({ texto, className = '' }) => {
  if (!texto) return null;

  // Protege sequências de escape literais R\$ e \$ antes do split de matemática
  const protegido = texto
    .replace(/R\\\$/g, MARCADO_REAL)
    .replace(/\\\$/g, MARCADO_DOLAR);

  // Divide por fórmulas KaTeX ($$...$$ e $...$)
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g;
  const partes = protegido.split(regex);

  const elementos = partes.map((parte, index) => {
    if (!parte) return null;

    // Display mode: $$...$$
    if (parte.startsWith('$$') && parte.endsWith('$$') && parte.length >= 4) {
      const latex = parte.slice(2, -2).trim();
      try {
        const html = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="katex-display-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        console.error('Erro ao renderizar KaTeX display:', err);
        return <code key={index}>{parte}</code>;
      }
    }

    // Inline mode: $...$
    if (parte.startsWith('$') && parte.endsWith('$') && parte.length >= 2) {
      const latex = parte.slice(1, -1);
      try {
        const html = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="katex-inline-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        console.error('Erro ao renderizar KaTeX inline:', err);
        return <code key={index}>{parte}</code>;
      }
    }

    // Restaura os marcadores protegidos para exibição em texto (sem a barra de escape)
    const textoRestaurado = parte
      .replace(new RegExp(MARCADO_REAL, 'g'), 'R$')
      .replace(new RegExp(MARCADO_DOLAR, 'g'), '$');

    return <span key={index}>{renderizarMarkdownInline(textoRestaurado)}</span>;
  });

  return <span className={className}>{elementos}</span>;
};

function renderizarMarkdownInline(str: string): React.ReactNode[] {
  // Trata **negrito** e *itálico*
  const tokens = str.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}
