import type { IndiceProvas, ResumoQuestao, FiltrosQuestoes } from './tipos';

/**
 * Filtra a lista de resumos de questões com base nos critérios selecionados.
 * Ordena por prova (2021 -> 2025-prova1 -> 2025-prova5) e ordemCaderno.
 */
export function filtrarQuestoes(
  indice: IndiceProvas,
  filtros: FiltrosQuestoes = {}
): ResumoQuestao[] {
  if (!indice || !Array.isArray(indice.questoes)) {
    return [];
  }

  const anoFiltro = filtros.ano && filtros.ano !== 'todos' ? Number(filtros.ano) : undefined;
  const provaFiltro = filtros.provaId && filtros.provaId !== 'todas' ? filtros.provaId : undefined;
  const parteFiltro = filtros.parte && filtros.parte !== 'todas' ? filtros.parte : undefined;
  const tipoFiltro = filtros.tipo && filtros.tipo !== 'todas' ? filtros.tipo : undefined;
  const termoFiltro = filtros.termo?.trim().toLowerCase();

  // Mapeia provaId para ano para checagem rápida
  const mapaProvaAno = new Map<string, number>();
  for (const p of indice.provas) {
    mapaProvaAno.set(p.id, p.ano);
  }

  const resultado = indice.questoes.filter((q) => {
    // Filtro por Prova
    if (provaFiltro && q.provaId !== provaFiltro) {
      return false;
    }

    // Filtro por Ano
    if (anoFiltro) {
      const anoDaProva = mapaProvaAno.get(q.provaId);
      if (anoDaProva !== anoFiltro) {
        return false;
      }
    }

    // Filtro por Parte (Formação Geral vs Específico)
    if (parteFiltro && q.parte !== parteFiltro) {
      return false;
    }

    // Filtro por Tipo (Objetiva vs Discursiva)
    if (tipoFiltro && q.tipo !== tipoFiltro) {
      return false;
    }

    // Filtro por Termo de busca
    if (termoFiltro) {
      const matchRotulo = q.rotulo.toLowerCase().includes(termoFiltro);
      const matchPrevia = q.previa.toLowerCase().includes(termoFiltro);
      const matchNumero = String(q.numero) === termoFiltro;
      if (!matchRotulo && !matchPrevia && !matchNumero) {
        return false;
      }
    }

    return true;
  });

  // Garante ordenação estável (ordem das provas e ordem no caderno)
  const ordemProvas: Record<string, number> = {
    '2021-licenciatura': 1,
    '2025-prova1': 2,
    '2025-prova5': 3,
  };

  resultado.sort((a, b) => {
    const pesoA = ordemProvas[a.provaId] ?? 99;
    const pesoB = ordemProvas[b.provaId] ?? 99;
    if (pesoA !== pesoB) return pesoA - pesoB;
    return a.ordemCaderno - b.ordemCaderno;
  });

  return resultado;
}

export interface VizinhasInfo {
  anterior: ResumoQuestao | null;
  proxima: ResumoQuestao | null;
  posicaoAtual: number; // 1-indexado
  total: number;
}

/**
 * Encontra a questão anterior e posterior dentro da lista filtrada atual.
 */
export function vizinhas(listaFiltrada: ResumoQuestao[], id: string): VizinhasInfo {
  const total = listaFiltrada.length;
  const index = listaFiltrada.findIndex((q) => q.id === id);

  if (index === -1) {
    return {
      anterior: null,
      proxima: null,
      posicaoAtual: 0,
      total,
    };
  }

  const anterior = index > 0 ? listaFiltrada[index - 1] : null;
  const proxima = index < total - 1 ? listaFiltrada[index + 1] : null;

  return {
    anterior,
    proxima,
    posicaoAtual: index + 1,
    total,
  };
}
