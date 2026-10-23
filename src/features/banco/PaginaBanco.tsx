import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { IndiceProvas, FiltrosQuestoes } from '../../data/tipos';
import { carregarIndice } from '../../data/carregar';
import { lerFiltrosDaUrl } from '../../data/url';
import { filtrarQuestoes } from '../../data/filtrar';
import { Filtros } from './Filtros';
import { ListaQuestoes } from './ListaQuestoes';
import { IDS_ASSUNTOS } from '../../data/assuntos';
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
  const filtros: FiltrosQuestoes = useMemo(() => lerFiltrosDaUrl(searchParams), [searchParams]);

  // Atualiza query params na URL ao mudar filtros
  const handleFiltrosChange = (novos: FiltrosQuestoes) => {
    const params = new URLSearchParams();
    if (novos.ano && novos.ano !== 'todos') params.set('ano', String(novos.ano));
    if (novos.provaId && novos.provaId !== 'todas') params.set('prova', novos.provaId);
    if (novos.parte && novos.parte !== 'todas') params.set('parte', novos.parte);
    if (novos.tipo && novos.tipo !== 'todas') params.set('tipo', novos.tipo);
    if (novos.assunto && novos.assunto !== 'todos') params.set('assunto', novos.assunto);
    // O campo de busca é controlado pela URL: o termo vai como digitado (com espaços) e
    // filtrarQuestoes aplica o trim só na comparação.
    if (novos.termo && novos.termo.trim() !== '') params.set('termo', novos.termo);

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
        <div className={styles.conteudo}>
          <p className={styles.carregandoTexto}>Carregando banco de questões do ENADE...</p>
          <div className={styles.esqueletoGrade} aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.esqueletoCard}>
                <span className={styles.esqueletoLinha} />
                <span className={styles.esqueletoLinha} />
                <span className={styles.esqueletoLinhaCurta} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (erro || !indice) {
    return (
      <div className={styles.paginaBanco}>
        <div className={styles.conteudo}>
          <div className={styles.vazioMensagem}>
            <p>{erro || 'Falha ao carregar os dados.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paginaBanco}>
      <header className={styles.hero}>
        <div className={styles.heroConteudo}>
          <p className={styles.sobretitulo}>ENADE · Matemática (Licenciatura)</p>
          <h1 className={styles.tituloPrincipal}>Banco de Questões</h1>
          <p className={styles.subtituloPrincipal}>
            Questões do ENADE 2021, 2025 e 2026. Filtre por ano, prova, parte, tipo ou assunto e abra a resolução
            comentada de cada uma.
          </p>
          <ul className={styles.numeros} aria-label="O acervo em números">
            <li>
              <strong>{indice.questoes.length}</strong> questões
            </li>
            <li>
              <strong>{indice.questoes.length}</strong> resoluções comentadas
            </li>
            <li>
              <strong>{indice.provas.length}</strong> provas oficiais
            </li>
            <li>
              <strong>{IDS_ASSUNTOS.length}</strong> assuntos
            </li>
          </ul>
        </div>
      </header>

      <div className={styles.conteudo}>
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
    </div>
  );
};
