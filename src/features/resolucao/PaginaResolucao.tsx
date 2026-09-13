import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import type { Questao, TextoBase, ProvaCompleta, Letra, IndiceProvas } from '../../data/tipos';
import { carregarQuestao, carregarIndice } from '../../data/carregar';
import { filtrarQuestoes, vizinhas } from '../../data/filtrar';
import { CartaoGabarito } from './CartaoGabarito';
import { PopupQuestao } from './PopupQuestao';
import { Markdown } from '../../components/Markdown';
import styles from './PaginaResolucao.module.css';

function extrairCorpoMarkdown(conteudo: string): string {
  if (conteudo.startsWith('---')) {
    const fimFrontmatter = conteudo.indexOf('\n---', 3);
    if (fimFrontmatter !== -1) {
      return conteudo.slice(fimFrontmatter + 4).trim();
    }
  }
  return conteudo;
}

export const PaginaResolucao: React.FC = () => {
  const { questaoId } = useParams<{ questaoId: string }>();
  const [searchParams] = useSearchParams();

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [textoBase, setTextoBase] = useState<TextoBase | undefined>(undefined);
  const [prova, setProva] = useState<ProvaCompleta | null>(null);
  const [indice, setIndice] = useState<IndiceProvas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Alternativa marcada pelo usuário
  const alternativaMarcada = (searchParams.get('marcada') as Letra) || null;

  useEffect(() => {
    if (!questaoId) return;
    setCarregando(true);
    setErro(null);

    Promise.all([carregarQuestao(questaoId), carregarIndice()])
      .then(([dadosQuestao, dadosIndice]) => {
        setQuestao(dadosQuestao.questao);
        setTextoBase(dadosQuestao.textoBase);
        setProva(dadosQuestao.prova);
        setIndice(dadosIndice);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar resolução:', err);
        setErro('Resolução não encontrada.');
        setCarregando(false);
      });
  }, [questaoId]);

  // Vizinhas dentro do filtro atual
  const infoVizinhas = useMemo(() => {
    if (!indice || !questaoId) {
      return { anterior: null, proxima: null, posicaoAtual: 0, total: 0 };
    }

    const anoParam = searchParams.get('ano');
    const provaParam = searchParams.get('prova') || searchParams.get('provaId');
    const parteParam = searchParams.get('parte');
    const tipoParam = searchParams.get('tipo');
    const termoParam = searchParams.get('termo');

    const listaFiltrada = filtrarQuestoes(indice, {
      ano: anoParam ? (anoParam === 'todos' ? 'todos' : Number(anoParam)) : 'todos',
      provaId: (provaParam as any) || 'todas',
      parte: (parteParam as any) || 'todas',
      tipo: (tipoParam as any) || 'todas',
      termo: termoParam || '',
    });

    return vizinhas(listaFiltrada, questaoId);
  }, [indice, questaoId, searchParams]);

  const queryStringAtual = useMemo(() => {
    const str = searchParams.toString();
    return str ? `?${str}` : '';
  }, [searchParams]);

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
  const idCurto = questao.tipo === 'discursiva'
    ? `d${String(questao.numero).padStart(2, '0')}`
    : `q${String(questao.numero).padStart(3, '0')}`;

  const conteudoResolucaoRaw =
    prova.resolucoes[questao.id] || prova.resolucoes[idCurto] || null;

  const corpoMarkdown = conteudoResolucaoRaw
    ? extrairCorpoMarkdown(conteudoResolucaoRaw)
    : null;

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

        {/* Resolução comentada ou aviso da Fase 6 */}
        {corpoMarkdown ? (
          <section aria-label="Passo a passo da resolução comentada">
            <Markdown conteudo={corpoMarkdown} />
          </section>
        ) : (
          <section className={styles.avisoResolucaoPendente} aria-label="Aviso de resolução">
            <h3>Resolução Comentada em Elaboração</h3>
            <p>
              O gabarito oficial indicado acima é a referência definitiva do INEP. A resolução comentada detalhada, passo a passo com análise rigorosa de todas as alternativas e checagem numérica, será incluída na <strong>Fase 6</strong> do projeto.
            </p>
          </section>
        )}

        {/* Rodapé com navegação */}
        <footer className={styles.rodapeResolucao}>
          <Link
            to={`/questao/${questao.id}${queryStringAtual}`}
            className={styles.btnAcao}
          >
            ← Voltar à questão
          </Link>

          <Link
            to={
              infoVizinhas.proxima
                ? `/questao/${infoVizinhas.proxima.id}${queryStringAtual}`
                : '#'
            }
            className={`${styles.btnAcao} ${
              !infoVizinhas.proxima ? styles.desabilitado : ''
            }`}
            aria-disabled={!infoVizinhas.proxima}
            tabIndex={!infoVizinhas.proxima ? -1 : 0}
          >
            Próxima questão →
          </Link>
        </footer>
      </div>
    </article>
  );
};
