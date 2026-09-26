import React from 'react';
import { Link } from 'react-router';
import type { ResumoQuestao, Letra } from '../../data/tipos';
import { ArrowLeft, ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import styles from './NavegacaoQuestao.module.css';

interface NavegacaoQuestaoProps {
  questaoId: string;
  tipo: 'objetiva' | 'discursiva';
  alternativaMarcada: Letra | null;
  anterior: ResumoQuestao | null;
  proxima: ResumoQuestao | null;
  posicaoAtual: number;
  totalFiltrado: number;
  queryStringParams: string;
}

export const NavegacaoQuestao: React.FC<NavegacaoQuestaoProps> = ({
  questaoId,
  tipo,
  alternativaMarcada,
  anterior,
  proxima,
  posicaoAtual,
  totalFiltrado,
  queryStringParams,
}) => {
  // Monta link para a resolução com a alternativa marcada (se houver)
  const queryResolucao = new URLSearchParams(queryStringParams.replace(/^\?/, ''));
  if (alternativaMarcada) {
    queryResolucao.set('marcada', alternativaMarcada);
  } else {
    queryResolucao.delete('marcada');
  }

  const linkResolucao = `/questao/${questaoId}/resolucao?${queryResolucao.toString()}`;
  const textoBotaoPrincipal = tipo === 'discursiva' ? 'Ver resposta esperada' : 'Ver gabarito';

  return (
    <nav className={styles.navegacaoContainer} aria-label="Navegação da questão">
      {/* Botão Primário: Ver Gabarito */}
      <div className={styles.barraAcoesPrimarias}>
        <Link to={linkResolucao} className={styles.btnGabarito}>
          <ListChecks size={22} aria-hidden="true" />
          {textoBotaoPrincipal}
        </Link>
      </div>

      {/* Barra Secundária: Anterior, Indicador de Posição, Próxima e Voltar */}
      <div className={styles.barraNavegacaoSecundaria}>
        <div>
          <Link to={`/${queryStringParams}`} className={styles.btnNav}>
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar ao banco
          </Link>
        </div>

        {posicaoAtual > 0 && totalFiltrado > 0 && (
          <div className={styles.progresso}>
            <div className={styles.posicaoIndicador}>
              Questão <strong>{posicaoAtual}</strong> de <strong>{totalFiltrado}</strong>
            </div>
            <div className={styles.barraProgresso} data-testid="barra-progresso" aria-hidden="true">
              <div
                className={styles.barraProgressoPreenchimento}
                style={{ width: `${(posicaoAtual / totalFiltrado) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className={styles.grupoAnteriorProxima}>
          <Link
            to={anterior ? `/questao/${anterior.id}${queryStringParams}` : '#'}
            className={`${styles.btnNav} ${!anterior ? styles.desabilitado : ''}`}
            aria-disabled={!anterior}
            tabIndex={!anterior ? -1 : 0}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Anterior
          </Link>
          <Link
            to={proxima ? `/questao/${proxima.id}${queryStringParams}` : '#'}
            className={`${styles.btnNav} ${!proxima ? styles.desabilitado : ''}`}
            aria-disabled={!proxima}
            tabIndex={!proxima ? -1 : 0}
          >
            Próxima
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
