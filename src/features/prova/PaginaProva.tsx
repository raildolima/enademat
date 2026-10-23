import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, ClipboardCheck, ListFilter } from 'lucide-react';
import type { IndiceProvas, Prova, ResumoQuestao } from '../../data/tipos';
import { carregarIndice } from '../../data/carregar';
import styles from './PaginaProva.module.css';

interface Grupo {
  titulo: string;
  /** Rótulo da composição, no singular e no plural */
  tipo: [string, string];
  parte: string;
  questoes: ResumoQuestao[];
}

/** Grupos da grade na ordem do caderno: objetivas de FG, discursivas de FG e objetivas do CE (RF11). */
function agruparQuestoes(questoes: ResumoQuestao[]): Grupo[] {
  const grupos: Grupo[] = [
    { titulo: 'Formação Geral — objetivas', tipo: ['objetiva', 'objetivas'], parte: 'Formação Geral', questoes: [] },
    { titulo: 'Formação Geral — discursivas', tipo: ['discursiva', 'discursivas'], parte: 'Formação Geral', questoes: [] },
    {
      titulo: 'Componente Específico — objetivas',
      tipo: ['objetiva', 'objetivas'],
      parte: 'Componente Específico',
      questoes: [],
    },
    {
      titulo: 'Componente Específico — discursivas',
      tipo: ['discursiva', 'discursivas'],
      parte: 'Componente Específico',
      questoes: [],
    },
  ];
  for (const q of questoes) {
    const indice = (q.parte === 'formacao-geral' ? 0 : 2) + (q.tipo === 'discursiva' ? 1 : 0);
    grupos[indice].questoes.push(q);
  }
  return grupos.filter((g) => g.questoes.length > 0);
}

function rotuloCurto(q: ResumoQuestao): string {
  return q.tipo === 'discursiva' ? `D${q.numero}` : String(q.numero).padStart(2, '0');
}

export const PaginaProva: React.FC = () => {
  const { provaId } = useParams<{ provaId: string }>();
  const [indice, setIndice] = useState<IndiceProvas | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    carregarIndice()
      .then((dados) => ativo && setIndice(dados))
      .catch(() => ativo && setErro('Não foi possível carregar a prova.'));
    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return (
      <div className={styles.paginaProva}>
        <p role="alert">{erro}</p>
      </div>
    );
  }

  if (!indice) {
    return (
      <div className={styles.paginaProva}>
        <p role="status">Carregando prova...</p>
      </div>
    );
  }

  const prova: Prova | undefined = indice.provas.find((p) => p.id === provaId);
  if (!prova) {
    return (
      <div className={styles.paginaProva}>
        <h1 className={styles.titulo}>Prova não encontrada</h1>
        <Link to="/" className={styles.btnSecundario}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao banco
        </Link>
      </div>
    );
  }

  const questoes = indice.questoes
    .filter((q) => q.provaId === prova.id)
    .sort((a, b) => a.ordemCaderno - b.ordemCaderno);
  const grupos = agruparQuestoes(questoes);
  // A navegação Anterior/Próxima a partir da grade fica restrita a esta prova
  const filtro = `?ano=${prova.ano}&prova=${prova.id}`;
  const primeira = questoes[0];

  return (
    <article className={styles.paginaProva}>
      <header className={styles.cabecalho}>
        <Link to="/" className={styles.linkVoltar}>
          <ArrowLeft size={16} aria-hidden="true" />
          Banco de Questões
        </Link>
        <h1 className={styles.titulo}>{prova.titulo}</h1>
        <p className={styles.subtitulo}>{prova.subtitulo}</p>
        <ul className={styles.composicao} aria-label="Composição da prova">
          {grupos.map((g) => (
            <li key={g.titulo}>
              <strong>{g.questoes.length}</strong> {g.tipo[g.questoes.length === 1 ? 0 : 1]} de {g.parte}
            </li>
          ))}
        </ul>
        <div className={styles.acoes}>
          {primeira && (
            <Link to={`/questao/${primeira.id}${filtro}`} className={styles.btnPrimario}>
              Começar pela {primeira.rotulo}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
          <Link to={`/simulado/${prova.id}`} className={styles.btnSecundario}>
            <ClipboardCheck size={18} aria-hidden="true" />
            Fazer simulado
          </Link>
          <Link to={`/${filtro}`} className={styles.btnSecundario}>
            <ListFilter size={18} aria-hidden="true" />
            Ver no banco de questões
          </Link>
        </div>
      </header>

      {grupos.map((g, i) => (
        <section key={g.titulo} className={styles.grupo} aria-labelledby={`grupo-${i}`}>
          <h2 id={`grupo-${i}`} className={styles.tituloGrupo}>
            {g.titulo}
          </h2>
          <ol className={styles.grade}>
            {g.questoes.map((q) => (
              <li key={q.id}>
                <Link to={`/questao/${q.id}${filtro}`} className={styles.celula} aria-label={q.rotulo}>
                  {rotuloCurto(q)}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
};
