import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import { useQuestao } from '../../data/useQuestao';
import { lerFiltrosDaUrl, lerLetraMarcada, queryStringSemMarcada } from '../../data/url';
import { filtrarQuestoes, vizinhas } from '../../data/filtrar';
import { CartaoGabarito } from './CartaoGabarito';
import { PopupQuestao } from './PopupQuestao';
import { Markdown } from '../../components/Markdown';
import { extrairCorpoMarkdown, resolucaoDaQuestao } from '../../data/resolucao';
import type { Letra } from '../../data/tipos';
import { DesempenhoNacional } from './DesempenhoNacional';
import { RelatarErro } from '../../components/RelatarErro';
import { QuestoesRelacionadas } from './QuestoesRelacionadas';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './PaginaResolucao.module.css';

export const PaginaResolucao: React.FC = () => {
  const { questaoId } = useParams<{ questaoId: string }>();
  const [searchParams] = useSearchParams();
  const { questao, textoBase, prova, indice, carregando, erro } = useQuestao(questaoId, 'Resolução não encontrada.');

  // Alternativa marcada pelo usuário (só letra existente na questão)
  const alternativaMarcada = questao ? lerLetraMarcada(searchParams, questao) : null;

  // Vizinhas dentro do filtro atual
  const infoVizinhas = useMemo(() => {
    if (!indice || !questaoId) {
      return { anterior: null, proxima: null, posicaoAtual: 0, total: 0 };
    }
    return vizinhas(filtrarQuestoes(indice, lerFiltrosDaUrl(searchParams)), questaoId);
  }, [indice, questaoId, searchParams]);

  const queryStringAtual = useMemo(() => {
    const str = searchParams.toString();
    return str ? `?${str}` : '';
  }, [searchParams]);

  // "Voltar à questão" leva a marcação; a próxima questão começa sem marcação.
  const queryProxima = useMemo(() => queryStringSemMarcada(searchParams), [searchParams]);

  if (carregando) {
    return (
      <div className={styles.paginaResolucao}>
        <div className={styles.carregandoContainer}>
          <p>Carregando resolução comentada...</p>
        </div>
      </div>
    );
  }

  if (erro || !questao || !prova) {
    return (
      <div className={styles.paginaResolucao}>
        <div className={styles.erroContainer}>
          <p>{erro || 'Resolução não encontrada.'}</p>
          <Link to={`/${queryStringAtual}`}>Voltar ao banco de questões</Link>
        </div>
      </div>
    );
  }

  // Gabarito oficial
  let gabaritoOficial: string | null = null;
  if (questao.tipo === 'objetiva' && prova.gabarito?.objetivas) {
    gabaritoOficial = prova.gabarito.objetivas[String(questao.numero)] || null;
  }

  // Resolução em Markdown se existir nos dados
  const conteudoResolucaoRaw = resolucaoDaQuestao(prova, questao);

  const corpoMarkdown = conteudoResolucaoRaw
    ? extrairCorpoMarkdown(conteudoResolucaoRaw)
    : null;
  const estatisticaItem =
    questao.tipo === 'objetiva' ? prova.estatisticas?.itens[String(questao.numero)] : undefined;

  return (
    <article className={styles.paginaResolucao}>
      {/* Barra superior fixa com título e botão pop-up Ver Questão */}
      <header className={styles.barraFixaSuperior}>
        <div className={styles.barraFixaConteudo}>
          <h1 className={styles.tituloResolucao}>
            Resolução · {questao.rotulo}
          </h1>
          <PopupQuestao questao={questao} textoBase={textoBase} />
        </div>
      </header>

      <div className={styles.corpoResolucao}>
        {/* Cartão de Gabarito Oficial e Feedback */}
        <CartaoGabarito
          questao={questao}
          gabaritoOficial={gabaritoOficial}
          alternativaMarcada={alternativaMarcada}
        />

        {/* Resolução comentada (o validador exige uma por questão; o aviso cobre só falha de dados) */}
        {corpoMarkdown ? (
          <section aria-label="Passo a passo da resolução comentada">
            <Markdown conteudo={corpoMarkdown} />
          </section>
        ) : (
          <section className={styles.avisoResolucaoPendente} aria-label="Aviso de resolução">
            <h2>Resolução indisponível</h2>
            <p>Não foi possível carregar a resolução comentada desta questão. O gabarito acima continua válido.</p>
          </section>
        )}

        {/* Índice de acerto nacional (RF16), quando há microdados do INEP para a prova */}
        {estatisticaItem && prova.estatisticas && (
          <DesempenhoNacional
            item={estatisticaItem}
            letras={questao.alternativas?.map((a) => a.letra) ?? []}
            gabarito={(gabaritoOficial as Letra | null) ?? null}
            presentes={prova.estatisticas.presentes}
            ano={prova.prova.ano}
            fonte={prova.estatisticas.fonte}
          />
        )}

        {indice && <QuestoesRelacionadas indice={indice} questaoId={questao.id} />}

        <RelatarErro questaoId={questao.id} rotulo={questao.rotulo} tela="resolução" />

        {/* Rodapé com navegação */}
        <footer className={styles.rodapeResolucao}>
          <Link
            to={`/questao/${questao.id}${queryStringAtual}`}
            className={styles.btnAcao}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar à questão
          </Link>

          <Link
            to={
              infoVizinhas.proxima
                ? `/questao/${infoVizinhas.proxima.id}${queryProxima}`
                : '#'
            }
            className={`${styles.btnAcao} ${
              !infoVizinhas.proxima ? styles.desabilitado : ''
            }`}
            aria-disabled={!infoVizinhas.proxima}
            tabIndex={!infoVizinhas.proxima ? -1 : 0}
          >
            Próxima questão
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </article>
  );
};
