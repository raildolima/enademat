import React, { Suspense, lazy, useId, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import styles from './DicaQuestao.module.css';

// react-markdown/KaTeX só são baixados quando o usuário pede a dica (CR-31: o chunk da questão fica leve).
const Markdown = lazy(async () => ({ default: (await import('../../components/Markdown')).Markdown }));

interface DicaQuestaoProps {
  /** Seção "Ideia-chave" da resolução: orienta sem revelar a alternativa correta (RF10). */
  dica: string;
}

export const DicaQuestao: React.FC<DicaQuestaoProps> = ({ dica }) => {
  const [aberta, setAberta] = useState(false);
  const idConteudo = useId();

  return (
    <section className={styles.dicaContainer} aria-label="Dica">
      <button
        type="button"
        className={styles.btnDica}
        aria-expanded={aberta}
        aria-controls={idConteudo}
        onClick={() => setAberta((v) => !v)}
      >
        <Lightbulb size={18} aria-hidden="true" />
        {aberta ? 'Ocultar dica' : 'Ver dica'}
      </button>
      <div id={idConteudo} hidden={!aberta} className={styles.dicaConteudo}>
        {aberta && (
          <Suspense fallback={<p role="status">Carregando dica...</p>}>
            <Markdown conteudo={dica} />
          </Suspense>
        )}
      </div>
    </section>
  );
};
