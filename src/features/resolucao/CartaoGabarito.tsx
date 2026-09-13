import React from 'react';
import type { Questao, Letra } from '../../data/tipos';
import { Blocos } from '../../components/Blocos';
import styles from './CartaoGabarito.module.css';

interface CartaoGabaritoProps {
  questao: Questao;
  gabaritoOficial: Letra | string | null;
  alternativaMarcada?: Letra | null;
}

export const CartaoGabarito: React.FC<CartaoGabaritoProps> = ({
  questao,
  gabaritoOficial,
  alternativaMarcada = null,
}) => {
  // Para questões discursivas
  if (questao.tipo === 'discursiva') {
    return (
      <section className={styles.cartaoGabarito} aria-label="Resposta esperada">
        <h2 className={styles.discursivaTitulo}>Padrão de Resposta Esperado</h2>
      </section>
    );
  }

  // Para questões objetivas
  const letraGabarito = (gabaritoOficial as Letra) || null;
  const alternativaCorreta = questao.alternativas?.find(
    (a) => a.letra === letraGabarito
  );

  const acertou = alternativaMarcada && letraGabarito && alternativaMarcada === letraGabarito;

  return (
    <section className={styles.cartaoGabarito} aria-label="Gabarito oficial">
      <div className={styles.cabecalhoGabarito}>
        <div>
          <span className={styles.letraGabaritoTexto}>
            Gabarito oficial: <strong>{letraGabarito || '—'}</strong>
          </span>
        </div>

        {/* Feedback da alternativa que o estudante marcou (se houver) */}
        {alternativaMarcada && (
          <div
            className={`${styles.feedbackMarcacao} ${
              acertou ? styles.feedbackCorreta : styles.feedbackIncorreta
            }`}
            role="status"
            aria-live="polite"
          >
            {acertou ? (
              <>
                <span className={styles.iconeStatus} aria-hidden="true">✓</span>
                <span>Você marcou <strong>{alternativaMarcada}</strong> — correta</span>
              </>
            ) : (
              <>
                <span className={styles.iconeStatus} aria-hidden="true">✗</span>
                <span>Você marcou <strong>{alternativaMarcada}</strong> — incorreta</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo SOMENTE da alternativa correta */}
      {alternativaCorreta && (
        <div className={styles.conteudoAlternativaCorreta}>
          <Blocos blocos={alternativaCorreta.blocos} />
        </div>
      )}
    </section>
  );
};
