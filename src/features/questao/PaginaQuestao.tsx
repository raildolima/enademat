import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import type { Letra } from '../../data/tipos';
import { useQuestao } from '../../data/useQuestao';
import { lerFiltrosDaUrl, lerLetraMarcada, queryStringSemMarcada } from '../../data/url';
import { filtrarQuestoes, vizinhas } from '../../data/filtrar';
import { ConteudoQuestao } from '../../components/ConteudoQuestao';
import { Badge } from '../../components/Badge';
import { NavegacaoQuestao } from './NavegacaoQuestao';
import { RascunhoDiscursiva } from './RascunhoDiscursiva';
import styles from './PaginaQuestao.module.css';

export const PaginaQuestao: React.FC = () => {
  const { questaoId } = useParams<{ questaoId: string }>();
  const [searchParams] = useSearchParams();
  const { questao, textoBase, prova, indice, carregando, erro } = useQuestao(
    questaoId,
    'Questão não encontrada ou falha ao carregar.'
  );

  // Marcação opcional da alternativa em memória (RF04), guardada junto com a questão a que pertence.
  // Enquanto o usuário não marca nada nesta questão, vale ?marcada= ("Voltar à questão" da resolução).
  const [selecao, setSelecao] = useState<{ questaoId: string; letra: Letra | null } | null>(null);
  const alternativaMarcada =
    questao && selecao?.questaoId === questao.id
      ? selecao.letra
      : questao
        ? lerLetraMarcada(searchParams, questao)
        : null;
  const selecionarAlternativa = (letra: Letra | null) => {
    if (questao) setSelecao({ questaoId: questao.id, letra });
  };

  // Calcula questões vizinhas respeitando os filtros ativos
  const infoVizinhas = useMemo(() => {
    if (!indice || !questaoId) {
      return { anterior: null, proxima: null, posicaoAtual: 0, total: 0 };
    }
    return vizinhas(filtrarQuestoes(indice, lerFiltrosDaUrl(searchParams)), questaoId);
  }, [indice, questaoId, searchParams]);

  // Filtros ativos para os links de navegação; a marcação é própria desta questão e não é propagada.
  const queryStringAtual = useMemo(() => queryStringSemMarcada(searchParams), [searchParams]);

  if (carregando) {
    return (
      <div className={styles.paginaQuestao}>
        <div className={styles.carregandoContainer}>
          <p>Carregando questão...</p>
        </div>
      </div>
    );
  }

  if (erro || !questao || !prova) {
    return (
      <div className={styles.paginaQuestao}>
        <div className={styles.erroContainer}>
          <p>{erro || 'Questão não encontrada.'}</p>
          <Link to={`/${queryStringAtual}`}>Voltar ao banco de questões</Link>
        </div>
      </div>
    );
  }

  const nomeProva = prova.prova.subtitulo || prova.prova.titulo;

  return (
    <article className={styles.paginaQuestao}>
      <header className={styles.cabecalhoQuestao}>
        {/* Breadcrumb acessível */}
        <nav className={styles.breadcrumb} aria-label="Migalhas de navegação">
          <Link to={`/${queryStringAtual}`} className={styles.linkBreadcrumb}>
            Banco de Questões
          </Link>
          <span className={styles.separadorBreadcrumb}>›</span>
          <span className={styles.linkBreadcrumb}>ENADE {prova.prova.ano}</span>
          <span className={styles.separadorBreadcrumb}>›</span>
          <span className={styles.linkBreadcrumb}>{nomeProva}</span>
          <span className={styles.separadorBreadcrumb}>›</span>
          <span aria-current="page">{questao.rotulo}</span>
        </nav>

        <div className={styles.tituloELinhas}>
          <h1 className={styles.tituloQuestao}>{questao.rotulo}</h1>
          <div className={styles.badgesGrupo}>
            <Badge
              variante={
                questao.parte === 'componente-especifico' ? 'primaria' : 'padrao'
              }
            >
              {questao.parte === 'componente-especifico'
                ? 'Componente Específico'
                : 'Formação Geral'}
            </Badge>
            <Badge variante={questao.tipo === 'discursiva' ? 'aviso' : 'padrao'}>
              {questao.tipo === 'discursiva' ? 'Discursiva' : 'Objetiva'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Conteúdo principal da questão */}
      <ConteudoQuestao
        questao={questao}
        textoBase={textoBase}
        alternativaMarcada={alternativaMarcada}
        onSelecionarAlternativa={selecionarAlternativa}
      />

      {/* Rascunho para discursivas */}
      {questao.tipo === 'discursiva' && (
        <div style={{ maxWidth: 'var(--largura-leitura)', margin: '0 auto' }}>
          <RascunhoDiscursiva linhasLimite={prova.prova.linhasDiscursiva} />
        </div>
      )}

      {/* Navegação inferior */}
      <NavegacaoQuestao
        questaoId={questao.id}
        tipo={questao.tipo}
        alternativaMarcada={alternativaMarcada}
        anterior={infoVizinhas.anterior}
        proxima={infoVizinhas.proxima}
        posicaoAtual={infoVizinhas.posicaoAtual}
        totalFiltrado={infoVizinhas.total}
        queryStringParams={queryStringAtual}
      />
    </article>
  );
};
