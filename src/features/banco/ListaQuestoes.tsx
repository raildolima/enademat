import React from 'react';
import { Link } from 'react-router';
import type { ResumoQuestao, Prova, ProvaId } from '../../data/tipos';
import { Badge } from '../../components/Badge';
import { TextoRico } from '../../components/TextoRico';
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

  const ordemProvas: ProvaId[] = ['2021-licenciatura', '2025-prova1', '2025-prova5'];
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
        const tituloSecao = infoProva
          ? `${infoProva.titulo} (${infoProva.ano})`
          : provaId;

        return (
          <section key={provaId} className={styles.grupoProva} aria-label={tituloSecao}>
            <h2 className={styles.tituloGrupo}>{tituloSecao}</h2>
            <div className={styles.gradeQuestoes}>
              {itensDaProva.map((q) => {
                const linkHref = `/questao/${q.id}${queryStringParams}`;
                return (
                  <Link key={q.id} to={linkHref} className={styles.cardQuestao}>
                    <div className={styles.cabecalhoCard}>
                      <span className={styles.rotuloQuestao}>{q.rotulo}</span>
                      <div className={styles.badgesGrupo}>
                        <Badge
                          variante={
                            q.parte === 'componente-especifico'
                              ? 'primaria'
                              : 'padrao'
                          }
                        >
                          {q.parte === 'componente-especifico'
                            ? 'Componente Específico'
                            : 'Formação Geral'}
                        </Badge>
                        <Badge
                          variante={
                            q.tipo === 'discursiva' ? 'aviso' : 'padrao'
                          }
                        >
                          {q.tipo === 'discursiva' ? 'Discursiva' : 'Objetiva'}
                        </Badge>
                      </div>
                    </div>
                    <div className={styles.previaQuestao}>
                      <TextoRico texto={q.previa} />
                    </div>
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
