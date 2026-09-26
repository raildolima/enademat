import React from 'react';
import type { Questao, TextoBase, Letra } from '../data/tipos';
import { Blocos } from './Blocos';
import { TextoRico } from './TextoRico';
import styles from './ConteudoQuestao.module.css';

interface ConteudoQuestaoProps {
  questao: Questao;
  textoBase?: TextoBase;
  alternativaMarcada?: Letra | null;
  onSelecionarAlternativa?: (letra: Letra | null) => void;
  somenteLeitura?: boolean;
  className?: string;
}

export const ConteudoQuestao: React.FC<ConteudoQuestaoProps> = ({
  questao,
  textoBase,
  alternativaMarcada = null,
  onSelecionarAlternativa,
  somenteLeitura = false,
  className = '',
}) => {
  const handleClickAlternativa = (letra: Letra) => {
    if (somenteLeitura || !onSelecionarAlternativa) return;
    if (alternativaMarcada === letra) {
      // Clicar de novo desmarca
      onSelecionarAlternativa(null);
    } else {
      onSelecionarAlternativa(letra);
    }
  };

  const letras = questao.alternativas?.map((alt) => alt.letra) ?? [];
  // Roving tabindex (padrão ARIA de radiogroup): só a marcada, ou a primeira, entra na ordem de Tab.
  const letraFocavel = alternativaMarcada && letras.includes(alternativaMarcada) ? alternativaMarcada : letras[0];

  const handleKeyDownAlternativa = (e: React.KeyboardEvent<HTMLDivElement>, letra: Letra) => {
    if (somenteLeitura || !onSelecionarAlternativa) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClickAlternativa(letra);
      return;
    }

    const passo = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (passo === 0) return;
    e.preventDefault();
    const destino = (letras.indexOf(letra) + passo + letras.length) % letras.length;
    const itens = e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
    itens?.[destino]?.focus();
    onSelecionarAlternativa(letras[destino]);
  };

  return (
    <div className={`${styles.containerQuestao} ${className}`.trim()}>
      {/* Texto-base compartilhado (se houver) */}
      {textoBase && (
        <section
          className={styles.secaoTextoBase}
          aria-label={textoBase.titulo || 'Texto-base da questão'}
        >
          <header className={styles.tituloTextoBase}>
            <span>{textoBase.titulo}</span>
          </header>
          <Blocos blocos={textoBase.blocos} />
        </section>
      )}

      {/* Enunciado da questão */}
      <section className={styles.secaoEnunciado} aria-label="Enunciado da questão">
        <Blocos blocos={questao.enunciado} />

        {/* Alternativas (para questões objetivas) */}
        {questao.tipo === 'objetiva' && questao.alternativas && (
          <div
            className={styles.alternativasLista}
            role={somenteLeitura ? undefined : 'radiogroup'}
            aria-label="Opções de resposta"
          >
            {questao.alternativas.map((alt) => {
              const marcada = alternativaMarcada === alt.letra;
              return (
                <div
                  key={alt.letra}
                  role={somenteLeitura ? undefined : 'radio'}
                  aria-checked={somenteLeitura ? undefined : marcada}
                  tabIndex={somenteLeitura ? undefined : alt.letra === letraFocavel ? 0 : -1}
                  className={`${styles.alternativaItem} ${marcada ? styles.marcada : ''} ${
                    somenteLeitura ? styles.somenteLeitura : ''
                  }`}
                  onClick={() => handleClickAlternativa(alt.letra)}
                  onKeyDown={(e) => handleKeyDownAlternativa(e, alt.letra)}
                >
                  <div className={styles.alternativaLetraCirculo}>
                    {alt.letra}
                  </div>
                  <div className={styles.alternativaConteudo}>
                    <Blocos blocos={alt.blocos} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Itens discursivos (se houver) */}
        {questao.tipo === 'discursiva' && questao.itens && questao.itens.length > 0 && (
          <div className={styles.discursivaItens} aria-label="Itens da questão discursiva">
            {questao.itens.map((item, idx) => (
              <div key={idx} className={styles.discursivaItemCard}>
                <div className={styles.discursivaItemCabecalho}>
                  <span>Item {item.rotulo}</span>
                  {item.valor && (
                    <span className={styles.discursivaItemValor}>({item.valor})</span>
                  )}
                </div>
                <div>
                  <TextoRico texto={item.texto} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
