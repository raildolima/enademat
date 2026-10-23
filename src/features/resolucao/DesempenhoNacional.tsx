import React from 'react';
import { TriangleAlert, Users } from 'lucide-react';
import type { EstatisticaItem, Letra } from '../../data/tipos';
import styles from './DesempenhoNacional.module.css';

interface DesempenhoNacionalProps {
  item: EstatisticaItem;
  letras: Letra[];
  gabarito: Letra | null;
  presentes: number;
  ano: number;
  fonte: string;
}

const pct = (valor: number) => `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

/** RF16: índice de acerto e distribuição das respostas dos estudantes de Matemática (microdados do INEP). */
export const DesempenhoNacional: React.FC<DesempenhoNacionalProps> = ({ item, letras, gabarito, presentes, ano, fonte }) => (
  <section className={styles.container} aria-labelledby="titulo-desempenho">
    <h2 id="titulo-desempenho" className={styles.titulo}>
      <Users size={20} aria-hidden="true" />
      Desempenho nacional no ENADE {ano}
    </h2>

    {item.anulada ? (
      <p className={styles.aviso}>
        <TriangleAlert size={18} aria-hidden="true" />
        No gabarito final publicado nos microdados do INEP, esta questão consta como <strong>anulada</strong>.
      </p>
    ) : (
      item.acerto !== undefined && (
        <p className={styles.destaque}>
          <strong>{pct(item.acerto)}</strong> dos {presentes.toLocaleString('pt-BR')} estudantes de Matemática
          (Licenciatura) acertaram esta questão.
        </p>
      )
    )}

    <ul className={styles.distribuicao} aria-label="Percentual de estudantes que marcou cada alternativa">
      {letras.map((letra) => {
        const valor = item.distribuicao[letra] ?? 0;
        const correta = !item.anulada && letra === gabarito;
        return (
          <li key={letra} className={styles.linha}>
            <span className={styles.letra}>
              {letra}
              {correta && <span className={styles.marcaGabarito}> (gabarito)</span>}
            </span>
            <span className={styles.trilho} aria-hidden="true">
              <span
                className={`${styles.barra} ${correta ? styles.barraCorreta : ''}`}
                style={{ width: `${valor}%` }}
              />
            </span>
            <span className={styles.valor}>{pct(valor)}</span>
          </li>
        );
      })}
      {item.brancoOuInvalida > 0 && (
        <li className={styles.linha}>
          <span className={styles.letra}>Em branco ou inválida</span>
          <span className={styles.trilho} aria-hidden="true">
            <span className={styles.barra} style={{ width: `${item.brancoOuInvalida}%` }} />
          </span>
          <span className={styles.valor}>{pct(item.brancoOuInvalida)}</span>
        </li>
      )}
    </ul>
    <p className={styles.fonte}>Fonte: {fonte}</p>
  </section>
);
