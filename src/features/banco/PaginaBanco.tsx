import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { IndiceProvas, FiltrosQuestoes, ProvaId, Parte } from '../../data/tipos';
import { carregarIndice } from '../../data/carregar';
import { filtrarQuestoes } from '../../data/filtrar';
import { Filtros } from './Filtros';
import { ListaQuestoes } from './ListaQuestoes';
import styles from './PaginaBanco.module.css';

export const PaginaBanco: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [indice, setIndice] = useState<IndiceProvas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarIndice()
      .then((dados) => {
        setIndice(dados);
        setCarregando(false);
      })
      .catch(() => {
        setErro('Erro ao carregar o banco de questões.');
        setCarregando(false);
      });
  }, []);

  // Extrai filtros dos query params da URL
  const filtros: FiltrosQuestoes = useMemo(() => {
    const anoParam = searchParams.get('ano');
    const provaParam = searchParams.get('prova') || searchParams.get('provaId');
    const parteParam = searchParams.get('parte');
    const tipoParam = searchParams.get('tipo');
    const termoParam = searchParams.get('termo') || searchParams.get('busca');

    return {
      ano: anoParam ? (anoParam === 'todos' ? 'todos' : Number(anoParam)) : 'todos',
      provaId: (provaParam as ProvaId) || 'todas',
      parte: (parteParam as Parte) || 'todas',
      tipo: (tipoParam as 'objetiva' | 'discursiva') || 'todas',
      termo: termoParam || '',
    };
  }, [searchParams]);

  // Atualiza query params na URL ao mudar filtros
  const handleFiltrosChange = (novos: FiltrosQuestoes) => {
    const params = new URLSearchParams();
    if (novos.ano && novos.ano !== 'todos') params.set('ano', String(novos.ano));
    if (novos.provaId && novos.provaId !== 'todas') params.set('prova', novos.provaId);
    if (novos.parte && novos.parte !== 'todas') params.set('parte', novos.parte);
    if (novos.tipo && novos.tipo !== 'todas') params.set('tipo', novos.tipo);
    if (novos.termo && novos.termo.trim() !== '') params.set('termo', novos.termo.trim());

    setSearchParams(params, { replace: true });
  };

  const questoesFiltradas = useMemo(() => {
    if (!indice) return [];
    return filtrarQuestoes(indice, filtros);
  }, [indice, filtros]);

  const queryStringAtual = useMemo(() => {
    const str = searchParams.toString();
    return str ? `?${str}` : '';
  }, [searchParams]);

  if (carregando) {
    return (
      <div className={styles.paginaBanco}>
        <div className={styles.carregandoContainer}>
          <p>Carregando banco de questões do ENADE...</p>
        </div>
      </div>
    );
  }

  if (erro || !indice) {
    return (
      <div className={styles.paginaBanco}>
        <div className={styles.vazioMensagem}>
          <p>{erro || 'Falha ao carregar os dados.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paginaBanco}>
      <header className={styles.cabecalhoPagina}>
        <h1 className={styles.tituloPrincipal}>Banco de Questões</h1>
        <p className={styles.subtituloPrincipal}>
          202 questões do ENADE Matemática Licenciatura (2021, 2025 Prova 1 e 2025 Prova 5).
        </p>
      </header>

      <Filtros
        filtros={filtros}
        onChangeFiltros={handleFiltrosChange}
        totalQuestoes={questoesFiltradas.length}
      />

      <ListaQuestoes
        questoes={questoesFiltradas}
        provas={indice.provas}
        queryStringParams={queryStringAtual}
      />
    </div>
  );
};
