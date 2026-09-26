import React from 'react';
import type { FiltrosQuestoes, ProvaId, Parte } from '../../data/tipos';
import { RotateCcw, Search } from 'lucide-react';
import styles from './Filtros.module.css';

interface FiltrosProps {
  filtros: FiltrosQuestoes;
  onChangeFiltros: (novosFiltros: FiltrosQuestoes) => void;
  totalQuestoes: number;
}

export const Filtros: React.FC<FiltrosProps> = ({
  filtros,
  onChangeFiltros,
  totalQuestoes,
}) => {
  const anoAtual = filtros.ano || 'todos';
  const provaAtual = filtros.provaId || 'todas';
  const parteAtual = filtros.parte || 'todas';
  const tipoAtual = filtros.tipo || 'todas';
  const termoAtual = filtros.termo || '';

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const novoAno = val === 'todos' ? 'todos' : Number(val);
    
    // Se o ano mudar para 2021 e a prova for de 2025 (ou vice-versa), limpa prova
    let novaProva: ProvaId | 'todas' = provaAtual;
    if (novoAno === 2021 && (provaAtual === '2025-prova1' || provaAtual === '2025-prova5')) {
      novaProva = 'todas';
    } else if (novoAno === 2025 && provaAtual === '2021-licenciatura') {
      novaProva = 'todas';
    }

    onChangeFiltros({
      ...filtros,
      ano: novoAno,
      provaId: novaProva,
    });
  };

  const handleProvaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ProvaId | 'todas';
    // Se selecionou uma prova de 2021, garante ano 2021; se 2025, garante ano 2025
    let novoAno = anoAtual;
    if (val === '2021-licenciatura') {
      novoAno = 2021;
    } else if (val === '2025-prova1' || val === '2025-prova5') {
      novoAno = 2025;
    }

    onChangeFiltros({
      ...filtros,
      provaId: val,
      ano: novoAno,
    });
  };

  const handleParteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFiltros({
      ...filtros,
      parte: e.target.value as Parte | 'todas',
    });
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFiltros({
      ...filtros,
      tipo: e.target.value as 'objetiva' | 'discursiva' | 'todas',
    });
  };

  const handleTermoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFiltros({
      ...filtros,
      termo: e.target.value,
    });
  };

  const handleLimpar = () => {
    onChangeFiltros({
      ano: 'todos',
      provaId: 'todas',
      parte: 'todas',
      tipo: 'todas',
      termo: '',
    });
  };

  // Opções de prova dependentes do ano
  const opcoesProva = [
    { id: 'todas', label: 'Todas as provas' },
    ...(anoAtual === 'todos' || anoAtual === 2021
      ? [{ id: '2021-licenciatura', label: '2021 · Licenciatura' }]
      : []),
    ...(anoAtual === 'todos' || anoAtual === 2025
      ? [
          { id: '2025-prova1', label: '2025 · Prova 1 (1ª aplicação)' },
          { id: '2025-prova5', label: '2025 · Prova 5 (2ª aplicação)' },
        ]
      : []),
  ];

  return (
    <div className={styles.filtrosContainer} role="search" aria-label="Filtros do banco de questões">
      <div className={styles.filtrosGrid}>
        {/* Filtro Ano */}
        <div className={styles.campoGrupo}>
          <label htmlFor="filtro-ano" className={styles.rotuloCampo}>
            Ano
          </label>
          <select
            id="filtro-ano"
            value={anoAtual}
            onChange={handleAnoChange}
            className={styles.selectCampo}
          >
            <option value="todos">Todos os anos</option>
            <option value="2021">2021</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Filtro Prova */}
        <div className={styles.campoGrupo}>
          <label htmlFor="filtro-prova" className={styles.rotuloCampo}>
            Prova
          </label>
          <select
            id="filtro-prova"
            value={provaAtual}
            onChange={handleProvaChange}
            className={styles.selectCampo}
          >
            {opcoesProva.map((op) => (
              <option key={op.id} value={op.id}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Parte */}
        <div className={styles.campoGrupo}>
          <label htmlFor="filtro-parte" className={styles.rotuloCampo}>
            Componente
          </label>
          <select
            id="filtro-parte"
            value={parteAtual}
            onChange={handleParteChange}
            className={styles.selectCampo}
          >
            <option value="todas">Todas as partes</option>
            <option value="formacao-geral">Formação Geral</option>
            <option value="componente-especifico">Componente Específico</option>
          </select>
        </div>

        {/* Filtro Tipo */}
        <div className={styles.campoGrupo}>
          <label htmlFor="filtro-tipo" className={styles.rotuloCampo}>
            Tipo de Questão
          </label>
          <select
            id="filtro-tipo"
            value={tipoAtual}
            onChange={handleTipoChange}
            className={styles.selectCampo}
          >
            <option value="todas">Todos os tipos</option>
            <option value="objetiva">Objetiva</option>
            <option value="discursiva">Discursiva</option>
          </select>
        </div>

        {/* Campo de Busca */}
        <div className={`${styles.campoGrupo} ${styles.buscaGrupo}`}>
          <label htmlFor="filtro-busca" className={styles.rotuloCampo}>
            Buscar por termo, fórmula ou número
          </label>
          <span className={styles.buscaCampo}>
            <Search size={18} className={styles.buscaIcone} aria-hidden="true" />
            <input
              id="filtro-busca"
              type="search"
              placeholder="Ex: chumbo, matriz, 32, derivada..."
              value={termoAtual}
              onChange={handleTermoChange}
              className={styles.inputCampo}
            />
          </span>
        </div>
      </div>

      <div className={styles.rodapeFiltros}>
        <div role="status" className={styles.contador}>
          <strong>{totalQuestoes}</strong> {totalQuestoes === 1 ? 'questão encontrada' : 'questões encontradas'}
        </div>
        <button type="button" onClick={handleLimpar} className={styles.btnLimpar}>
          <RotateCcw size={16} aria-hidden="true" />
          Limpar filtros
        </button>
      </div>
    </div>
  );
};
