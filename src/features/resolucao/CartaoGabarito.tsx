import React from 'react';
import type { Questao, Letra } from '../../data/tipos';
import { Blocos } from '../../components/Blocos';
import { CircleCheck, CircleX, FileText } from 'lucide-react';
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
        <h2 className={styles.discursivaTitulo}>
          <FileText size={22} aria-hidden="true" />
          Resposta esperada
        </h2>
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
            Gabarito: <strong>{letraGabarito || '—'}</strong>
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
                <CircleCheck size={22} className={styles.iconeStatus} aria-hidden="true" />
                <span>Você marcou <strong>{alternativaMarcada}</strong> — correta</span>
              </>
            ) : (
              <>
                <CircleX size={22} className={styles.iconeStatus} aria-hidden="true" />
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
