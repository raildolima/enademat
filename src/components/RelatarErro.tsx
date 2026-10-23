import React from 'react';
import { MessageSquareWarning } from 'lucide-react';
import styles from './RelatarErro.module.css';

/** Repositório público onde as issues de erro são abertas (RF12). */
export const URL_REPOSITORIO = 'https://github.com/raildolima/enademat';

/** Link para uma issue nova já preenchida com a questão e a tela de origem. */
export function urlNovaIssue(questaoId: string, rotulo: string, tela: 'questão' | 'resolução'): string {
  const titulo = `Erro na ${tela}: ${rotulo} (${questaoId})`;
  const corpo = [
    `**Questão:** \`${questaoId}\``,
    `**Tela:** ${tela}`,
    `**Endereço:** ${typeof window !== 'undefined' ? window.location.href : ''}`,
    '',
    '**O que está errado?**',
    '',
    '',
    '**Como deveria ser (se souber)?**',
    '',
  ].join('\n');
  return `${URL_REPOSITORIO}/issues/new?title=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}`;
}

interface RelatarErroProps {
  questaoId: string;
  rotulo: string;
  tela: 'questão' | 'resolução';
}

export const RelatarErro: React.FC<RelatarErroProps> = ({ questaoId, rotulo, tela }) => (
  <p className={`${styles.container} nao-imprimir`}>
    <a href={urlNovaIssue(questaoId, rotulo, tela)} target="_blank" rel="noopener noreferrer" className={styles.link}>
      <MessageSquareWarning size={16} aria-hidden="true" />
      Relatar erro nesta {tela}
      <span className="sr-only"> (abre o GitHub em nova aba)</span>
    </a>
  </p>
);
