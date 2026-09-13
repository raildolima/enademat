import React, { useState } from 'react';
import styles from './RascunhoDiscursiva.module.css';

interface RascunhoDiscursivaProps {
  linhasLimite?: number;
}

export const RascunhoDiscursiva: React.FC<RascunhoDiscursivaProps> = ({
  linhasLimite = 30,
}) => {
  const [texto, setTexto] = useState('');

  return (
    <div className={styles.rascunhoContainer}>
      <div className={styles.rascunhoCabecalho}>
        <label htmlFor="campo-rascunho" className={styles.rascunhoTitulo}>
          Rascunho da sua resposta
        </label>
        <span className={styles.rascunhoAviso}>
          Opcional · Não é salvo · Limite indicativo de até {linhasLimite} linhas
        </span>
      </div>
      <textarea
        id="campo-rascunho"
        className={styles.textareaRascunho}
        placeholder="Escreva aqui seu rascunho ou passos de raciocínio antes de conferir o padrão esperado..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={Math.min(15, linhasLimite)}
      />
    </div>
  );
};
