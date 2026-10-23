import React from 'react';
import type { FiltrosQuestoes, ProvaId, Parte } from '../../data/tipos';
import { RotateCcw, Search } from 'lucide-react';
import { ASSUNTOS } from '../../data/assuntos';
import styles from './Filtros.module.css';

const PROVAS_POR_ANO: { id: ProvaId; ano: number; label: string }[] = [
  { id: '2021-licenciatura', ano: 2021, label: '2021 · Licenciatura' },
  { id: '2025-prova1', ano: 2025, label: '2025 · Prova 1 (1ª aplicação)' },
  { id: '2025-prova5', ano: 2025, label: '2025 · Prova 5 (2ª aplicação)' },
  { id: '2026-prova1', ano: 2026, label: '2026 · Prova 1' },
];
const ANOS = [...new Set(PROVAS_POR_ANO.map((p) => p.ano))];

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
  const assuntoAtual = filtros.assunto || 'todos';

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const novoAno = val === 'todos' ? 'todos' : Number(val);
    
    // Se a prova escolhida não pertence ao novo ano, limpa prova
    let novaProva: ProvaId | 'todas' = provaAtual;
    const anoDaProva = PROVAS_POR_ANO.find((p) => p.id === provaAtual)?.ano;
    if (novoAno !== 'todos' && anoDaProva !== undefined && anoDaProva !== novoAno) {
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
    // Selecionar uma prova fixa o ano dela
    const novoAno = PROVAS_POR_ANO.find((p) => p.id === val)?.ano ?? anoAtual;

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

  const handleAssuntoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFiltros({
      ...filtros,
      assunto: e.target.value,
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
      assunto: 'todos',
      termo: '',
    });
  };

  // Opções de prova dependentes do ano
  const opcoesProva = [
    { id: 'todas', label: 'Todas as provas' },
    ...PROVAS_POR_ANO.filter((p) => anoAtual === 'todos' || p.ano === anoAtual),
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
            {ANOS.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
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

        {/* Filtro Assunto (RF14), agrupado como no vocabulário */}
        <div className={styles.campoGrupo}>
          <label htmlFor="filtro-assunto" className={styles.rotuloCampo}>
            Assunto
          </label>
          <select
            id="filtro-assunto"
            value={assuntoAtual}
            onChange={handleAssuntoChange}
            className={styles.selectCampo}
          >
            <option value="todos">Todos os assuntos</option>
            {['Matemática', 'Educação Matemática', 'Formação Geral'].map((grupo) => (
              <optgroup key={grupo} label={grupo}>
                {ASSUNTOS.filter((a) => a.grupo === grupo).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.rotulo}
                  </option>
                ))}
              </optgroup>
            ))}
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
