import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import type { Questao, TextoBase, ProvaCompleta, Letra, IndiceProvas } from '../../data/tipos';
import { carregarQuestao, carregarIndice } from '../../data/carregar';
import { filtrarQuestoes, vizinhas } from '../../data/filtrar';
import { ConteudoQuestao } from '../../components/ConteudoQuestao';
import { Badge } from '../../components/Badge';
import { NavegacaoQuestao } from './NavegacaoQuestao';
import { RascunhoDiscursiva } from './RascunhoDiscursiva';
import styles from './PaginaQuestao.module.css';

export const PaginaQuestao: React.FC = () => {
  const { questaoId } = useParams<{ questaoId: string }>();
  const [searchParams] = useSearchParams();

  const [questao, setQuestao] = useState<Questao | null>(null);
  const [textoBase, setTextoBase] = useState<TextoBase | undefined>(undefined);
  const [prova, setProva] = useState<ProvaCompleta | null>(null);
  const [indice, setIndice] = useState<IndiceProvas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Marcação opcional da alternativa em memória (RF04)
  const [alternativaMarcada, setAlternativaMarcada] = useState<Letra | null>(null);

  // Ao trocar de questão, reseta a marcação
  useEffect(() => {
    setAlternativaMarcada(null);
  }, [questaoId]);

  // Carrega a questão e o índice de navegação
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
        console.error('Erro ao carregar questão:', err);
        setErro('Questão não encontrada ou falha ao carregar.');
        setCarregando(false);
      });
  }, [questaoId]);

  // Calcula questões vizinhas respeitando os filtros ativos
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
        onSelecionarAlternativa={setAlternativaMarcada}
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
