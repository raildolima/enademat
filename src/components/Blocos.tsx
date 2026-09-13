import React from 'react';
import type { Bloco } from '../data/tipos';
import { TextoRico } from './TextoRico';
import styles from './Blocos.module.css';

interface BlocosProps {
  blocos: Bloco[];
  className?: string;
}

export const normalizarSrcImagem = (src: string): string => {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const limpo = src.replace(/^\.?\//, '');
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${limpo}` : `${base}/${limpo}`;
};

export const Blocos: React.FC<BlocosProps> = ({ blocos, className = '' }) => {
  if (!blocos || !Array.isArray(blocos) || blocos.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {blocos.map((bloco, idx) => {
        switch (bloco.tipo) {
          case 'titulo':
            return (
              <h3 key={idx} className={styles.blocoTitulo}>
                <TextoRico texto={bloco.texto} />
              </h3>
            );

          case 'paragrafo':
            return (
              <p key={idx} className={styles.blocoParagrafo}>
                <TextoRico texto={bloco.texto} />
              </p>
            );

          case 'formula':
            return (
              <div key={idx} className={styles.blocoFormula}>
                <TextoRico texto={`$$${bloco.latex}$$`} />
              </div>
            );

          case 'lista': {
            const ListaTag = bloco.ordenada ? 'ol' : 'ul';
            return (
              <ListaTag key={idx} className={styles.blocoLista}>
                {bloco.itens.map((item, itemIdx) => (
                  <li key={itemIdx} className={styles.blocoListaItem}>
                    <TextoRico texto={item} />
                  </li>
                ))}
              </ListaTag>
            );
          }

          case 'afirmativas':
            return (
              <div key={idx} className={styles.blocoAfirmativas}>
                {bloco.itens.map((item, itemIdx) => (
                  <div key={itemIdx} className={styles.afirmativaItem}>
                    <span className={styles.afirmativaRotulo}>{item.rotulo}</span>
                    <div>
                      <TextoRico texto={item.texto} />
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'conectivo':
            return (
              <div key={idx} className={styles.blocoConectivo} aria-hidden="true">
                {bloco.texto}
              </div>
            );

          case 'tabela':
            return (
              <figure key={idx} className="tabela-container">
                <table>
                  {bloco.cabecalho && bloco.cabecalho.length > 0 && (
                    <thead>
                      <tr>
                        {bloco.cabecalho.map((col, cIdx) => (
                          <th key={cIdx} scope="col">
                            <TextoRico texto={col} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {bloco.linhas.map((linha, lIdx) => (
                      <tr key={lIdx}>
                        {linha.map((celula, cIdx) => (
                          <td key={cIdx}>
                            <TextoRico texto={celula} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bloco.legenda && (
                  <figcaption className={styles.blocoLegenda}>
                    <TextoRico texto={bloco.legenda} />
                  </figcaption>
                )}
              </figure>
            );

          case 'imagem': {
            const imgSrc = normalizarSrcImagem(bloco.src);
            return (
              <figure key={idx} className={styles.blocoImagemContainer}>
                <img
                  src={imgSrc}
                  alt={bloco.alt}
                  loading="lazy"
                  style={bloco.larguraMaxPx ? { maxWidth: `${bloco.larguraMaxPx}px` } : undefined}
                  className={styles.blocoImagem}
                />
                {bloco.legenda && (
                  <figcaption className={styles.blocoLegenda}>
                    <TextoRico texto={bloco.legenda} />
                  </figcaption>
                )}
              </figure>
            );
          }

          case 'quadro':
            return (
              <aside key={idx} className={styles.blocoQuadro}>
                <Blocos blocos={bloco.blocos} />
              </aside>
            );

          case 'fonte':
            return (
              <p key={idx} className={styles.blocoFonte}>
                <TextoRico texto={bloco.texto} />
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
