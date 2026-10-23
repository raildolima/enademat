import type { Gabarito, Letra, Parte, Questao } from './tipos';

export type ModoSimulado = 'treino' | 'prova';

/** Marcador de questão em branco na codificação das respostas na URL. */
const EM_BRANCO = '-';
const LETRAS: readonly Letra[] = ['A', 'B', 'C', 'D', 'E'];

/** Questões do simulado: as objetivas da prova, na ordem do caderno (discursivas ficam de fora da correção). */
export function questoesDoSimulado(questoes: Questao[]): Questao[] {
  return questoes.filter((q) => q.tipo === 'objetiva').sort((a, b) => a.ordemCaderno - b.ordemCaderno);
}

/**
 * Respostas a partir de ?r= (um caractere por questão; "-" = em branco). O estado do simulado vive só
 * na URL e na memória (RF04/RF15): recarregar ou compartilhar o link não perde as marcações.
 * Letras que não existem na questão são descartadas.
 */
export function decodificarRespostas(param: string | null, questoes: Questao[]): (Letra | null)[] {
  return questoes.map((q, i) => {
    const c = param?.[i]?.toUpperCase() as Letra | undefined;
    const validas = q.alternativas?.map((a) => a.letra) ?? [];
    return c && LETRAS.includes(c) && validas.includes(c) ? c : null;
  });
}

export function codificarRespostas(respostas: (Letra | null)[]): string {
  return respostas.map((r) => r ?? EM_BRANCO).join('');
}

export interface ResultadoParte {
  parte: Parte;
  total: number;
  acertos: number;
  erros: number;
  emBranco: number;
}

export interface ResultadoSimulado {
  total: number;
  acertos: number;
  porParte: ResultadoParte[];
  /** Questões erradas ou em branco, na ordem do caderno, com a letra marcada (null = em branco). */
  revisar: { questao: Questao; marcada: Letra | null; correta: Letra }[];
}

/**
 * Correção pelo gabarito oficial. Questões sem gabarito e as anuladas no gabarito final do INEP
 * (RF16, números em `anuladas`) não entram na conta.
 */
export function corrigirSimulado(
  questoes: Questao[],
  respostas: (Letra | null)[],
  gabarito: Gabarito,
  anuladas: ReadonlySet<number> = new Set()
): ResultadoSimulado {
  const partes = new Map<Parte, ResultadoParte>();
  const revisar: ResultadoSimulado['revisar'] = [];
  let total = 0;
  let acertos = 0;

  questoes.forEach((q, i) => {
    const correta = gabarito.objetivas[String(q.numero)];
    if (!correta || anuladas.has(q.numero)) return;
    const marcada = respostas[i] ?? null;
    const parte = partes.get(q.parte) ?? { parte: q.parte, total: 0, acertos: 0, erros: 0, emBranco: 0 };
    parte.total += 1;
    total += 1;
    if (marcada === correta) {
      parte.acertos += 1;
      acertos += 1;
    } else {
      if (marcada) parte.erros += 1;
      else parte.emBranco += 1;
      revisar.push({ questao: q, marcada, correta });
    }
    partes.set(q.parte, parte);
  });

  const ordem: Parte[] = ['formacao-geral', 'componente-especifico'];
  return {
    total,
    acertos,
    porParte: ordem.flatMap((p) => (partes.has(p) ? [partes.get(p)!] : [])),
    revisar,
  };
}

/** "1h05min09s" a partir de segundos, para o cronômetro. */
export function formatarDuracao(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}h${mm}min${ss}s` : `${mm}min${ss}s`;
}
