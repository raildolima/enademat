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

  // Substitui escape R\$ fora da matemática se necessário
  const processado = conteudo.replace(/R\\\$/g, 'R$');

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
