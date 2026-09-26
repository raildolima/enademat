import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';

interface MarkdownProps {
  conteudo: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ conteudo, className = '' }) => {
  if (!conteudo) return null;

  // Cifrão literal (R\$ ou \$) vira a entidade &#36; para o remark-math não o tomar como delimitador.
  // Uma única varredura da esquerda para a direita: code spans e fórmulas (que podem conter \$, como
  // em \text{R\$ }) passam intactos, e um \$ é consumido antes de poder abrir uma fórmula.
  const regexTrechos = /(`+)[\s\S]*?\1|\$\$[\s\S]+?\$\$|\$(?:\\.|[^$\\\n])+?\$|R\\\$|\\\$/g;
  const processado = conteudo.replace(regexTrechos, (trecho) =>
    trecho === 'R\\$' ? 'R&#36;' : trecho === '\\$' ? '&#36;' : trecho
  );

  return (
    <div className={`${styles.markdownContainer} ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {processado}
      </ReactMarkdown>
    </div>
  );
};
