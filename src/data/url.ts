import type { FiltrosQuestoes, Letra, Parte, ProvaId, Questao } from './tipos';
import { IDS_ASSUNTOS } from './assuntos';

const PROVAS: Record<ProvaId, number> = {
  '2021-licenciatura': 2021,
  '2025-prova1': 2025,
  '2025-prova5': 2025,
  '2026-prova1': 2026,
};
const PARTES: readonly Parte[] = ['formacao-geral', 'componente-especifico'];
const TIPOS = ['objetiva', 'discursiva'] as const;

function ehProvaId(valor: string | null): valor is ProvaId {
  return valor !== null && valor in PROVAS;
}

/**
 * Filtros do banco a partir da query string, descartando valores desconhecidos
 * (e a prova que não pertence ao ano escolhido). Usado pelo banco, questão e resolução.
 */
export function lerFiltrosDaUrl(params: URLSearchParams): FiltrosQuestoes {
  const anoParam = Number(params.get('ano'));
  const ano = Object.values(PROVAS).includes(anoParam) ? anoParam : 'todos';

  const provaParam = params.get('prova') || params.get('provaId');
  const provaId = ehProvaId(provaParam) && (ano === 'todos' || PROVAS[provaParam] === ano) ? provaParam : 'todas';

  const parteParam = params.get('parte') as Parte | null;
  const tipoParam = params.get('tipo') as (typeof TIPOS)[number] | null;
  const assuntoParam = params.get('assunto');

  return {
    ano,
    provaId,
    parte: parteParam && PARTES.includes(parteParam) ? parteParam : 'todas',
    tipo: tipoParam && TIPOS.includes(tipoParam) ? tipoParam : 'todas',
    termo: params.get('termo') || params.get('busca') || '',
    assunto: assuntoParam && (IDS_ASSUNTOS as readonly string[]).includes(assuntoParam) ? assuntoParam : 'todos',
  };
}

/** Alternativa em ?marcada=, somente se existir entre as alternativas da questão. */
export function lerLetraMarcada(params: URLSearchParams, questao: Questao): Letra | null {
  const marcada = params.get('marcada');
  return questao.alternativas?.find((alt) => alt.letra === marcada)?.letra ?? null;
}

/** Query string ("?..." ou "") sem o parâmetro marcada, para links que levam a outra questão. */
export function queryStringSemMarcada(params: URLSearchParams): string {
  const copia = new URLSearchParams(params);
  copia.delete('marcada');
  const str = copia.toString();
  return str ? `?${str}` : '';
}
