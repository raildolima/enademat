import React from 'react';
import { Link } from 'react-router';
import type { IndiceProvas } from '../../data/tipos';
import { questoesRelacionadas } from '../../data/relacionadas';
import { rotuloAssunto } from '../../data/assuntos';
import styles from './QuestoesRelacionadas.module.css';

interface QuestoesRelacionadasProps {
  indice: IndiceProvas;
  questaoId: string;
}

/** RF14: até cinco questões com o mesmo assunto principal, em qualquer prova. */
export const QuestoesRelacionadas: React.FC<QuestoesRelacionadasProps> = ({ indice, questaoId }) => {
  const relacionadas = questoesRelacionadas(indice.questoes, questaoId);
  const principal = indice.questoes.find((q) => q.id === questaoId)?.assuntos?.[0];
  if (!principal || relacionadas.length === 0) return null;

  const anoDaProva = new Map(indice.provas.map((p) => [p.id, p.ano]));

  return (
    <section className={`${styles.container} nao-imprimir`} aria-labelledby="titulo-relacionadas">
      <h2 id="titulo-relacionadas" className={styles.titulo}>
        Questões relacionadas
      </h2>
      <p className={styles.subtitulo}>Mesmo assunto principal: {rotuloAssunto(principal)}</p>
      <ul className={styles.lista}>
        {relacionadas.map((q) => (
          <li key={q.id}>
            <Link to={`/questao/${q.id}?assunto=${principal}`} className={styles.link}>
              ENADE {anoDaProva.get(q.provaId)} · {q.rotulo}
            </Link>
            <span className={styles.previa}>{q.previa}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
