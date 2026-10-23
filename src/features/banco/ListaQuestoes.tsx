import React from 'react';
import { Link } from 'react-router';
import type { ResumoQuestao, Prova, ProvaId } from '../../data/tipos';
import { Badge } from '../../components/Badge';
import { TextoRico } from '../../components/TextoRico';
import { ArrowRight } from 'lucide-react';
import { rotuloAssunto } from '../../data/assuntos';
import styles from './ListaQuestoes.module.css';

interface ListaQuestoesProps {
  questoes: ResumoQuestao[];
  provas: Prova[];
  queryStringParams?: string;
}

export const ListaQuestoes: React.FC<ListaQuestoesProps> = ({
  questoes,
  provas,
  queryStringParams = '',
}) => {
  if (questoes.length === 0) {
    return (
      <div className={styles.vazioMensagem}>
        <p>Nenhuma questão encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  // Agrupa questões por prova
  const mapaProvas = new Map<ProvaId, Prova>();
  for (const p of provas) {
    mapaProvas.set(p.id, p);
  }

  const ordemProvas: ProvaId[] = ['2021-licenciatura', '2025-prova1', '2025-prova5', '2026-prova1'];
  const questoesPorProva = new Map<ProvaId, ResumoQuestao[]>();

  for (const id of ordemProvas) {
    questoesPorProva.set(id, []);
  }

  for (const q of questoes) {
    if (questoesPorProva.has(q.provaId)) {
      questoesPorProva.get(q.provaId)!.push(q);
    }
  }

  return (
    <div className={styles.listaContainer}>
      {ordemProvas.map((provaId) => {
        const itensDaProva = questoesPorProva.get(provaId) || [];
        if (itensDaProva.length === 0) return null;

        const infoProva = mapaProvas.get(provaId);
        // O título da prova já começa por "ENADE <ano>"
        const tituloSecao = infoProva ? infoProva.titulo : provaId;

        return (
          <section key={provaId} className={styles.grupoProva} aria-label={tituloSecao} data-prova={provaId}>
            <div className={styles.cabecalhoGrupo}>
              <h2 className={styles.tituloGrupo}>{tituloSecao}</h2>
              <p className={styles.metaGrupo}>
                <span>
                  {itensDaProva.length} {itensDaProva.length === 1 ? 'questão' : 'questões'}
                </span>
                <Link to={`/prova/${provaId}`} className={styles.linkProva}>
                  Ver a prova completa (grade de questões)
                </Link>
              </p>
            </div>
            <div className={styles.gradeQuestoes}>
              {itensDaProva.map((q, idx) => {
                const linkHref = `/questao/${q.id}${queryStringParams}`;
                return (
                  <Link
                    key={q.id}
                    to={linkHref}
                    className={styles.cardQuestao}
                    style={{ '--ordem': Math.min(idx, 11) } as React.CSSProperties}
                  >
                    <div className={styles.cabecalhoCard}>
                      <span className={styles.rotuloQuestao}>{q.rotulo}</span>
                      <ArrowRight size={20} className={styles.setaCard} aria-hidden="true" />
                    </div>
                    <div className={styles.badgesGrupo}>
                      <Badge variante={q.parte === 'componente-especifico' ? 'primaria' : 'padrao'}>
                        {q.parte === 'componente-especifico' ? 'Componente Específico' : 'Formação Geral'}
                      </Badge>
                      <Badge variante={q.tipo === 'discursiva' ? 'aviso' : 'padrao'}>
                        {q.tipo === 'discursiva' ? 'Discursiva' : 'Objetiva'}
                      </Badge>
                    </div>
                    <div className={styles.previaQuestao}>
                      <TextoRico texto={q.previa} />
                    </div>
                    {q.assuntos && q.assuntos.length > 0 && (
                      <p className={styles.assuntosCard}>
                        <span className="sr-only">Assuntos: </span>
                        {q.assuntos.map(rotuloAssunto).join(' · ')}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
