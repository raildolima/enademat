export type ProvaId = '2021-licenciatura' | '2025-prova1' | '2025-prova5' | '2026-prova1';
export type Letra = 'A' | 'B' | 'C' | 'D' | 'E';
export type Parte = 'formacao-geral' | 'componente-especifico';

/** Markdown inline (negrito/itálico) + LaTeX inline $...$. Sem HTML. Real = "R\$". */
export type TextoRico = string;

export type Bloco =
  | { tipo: 'titulo'; texto: TextoRico }
  | { tipo: 'paragrafo'; texto: TextoRico }
  | { tipo: 'formula'; latex: string }
  | { tipo: 'lista'; ordenada: boolean; itens: TextoRico[] }
  | { tipo: 'afirmativas'; itens: { rotulo: 'I' | 'II' | 'III' | 'IV' | 'V'; texto: TextoRico }[] }
  | { tipo: 'conectivo'; texto: 'PORQUE' }
  | { tipo: 'tabela'; cabecalho?: TextoRico[]; linhas: TextoRico[][]; legenda?: TextoRico }
  | {
      tipo: 'imagem';
      src: string;
      alt: string;
      legenda?: TextoRico;
      larguraMaxPx?: number;
      /** Dimensões em px do arquivo, preenchidas pelo content:build */
      largura?: number;
      altura?: number;
    }
  | { tipo: 'quadro'; blocos: Bloco[] }
  | { tipo: 'fonte'; texto: TextoRico };

export interface Prova {
  id: ProvaId;
  ano: 2021 | 2025 | 2026;
  ordem: number;
  titulo: string;
  subtitulo: string;
  arquivoProva: string;
  arquivoGabarito: string;
  alternativasPorQuestao: 4 | 5;
  linhasDiscursiva: 15 | 30;
}

export interface TextoBase {
  id: string;
  provaId: ProvaId;
  titulo: string;
  questoes: number[];
  blocos: Bloco[];
}

export interface Alternativa {
  letra: Letra;
  blocos: Bloco[];
}

export interface Questao {
  id: string;
  provaId: ProvaId;
  tipo: 'objetiva' | 'discursiva';
  numero: number;
  rotulo: string;
  parte: Parte;
  ordemCaderno: number;
  paginas: number[];
  textoBaseId?: string;
  enunciado: Bloco[];
  alternativas?: Alternativa[];
  itens?: { rotulo: string; texto: TextoRico; valor?: string }[];
  notaEditorial?: string;
  /** RF14: assuntos do vocabulário fechado (src/data/assuntos.ts), anexados no build a partir de assuntos.json */
  assuntos?: string[];
}

export interface Gabarito {
  provaId: ProvaId;
  fonte: string;
  objetivas: Record<string, Letra>;
  discursivas: string[];
}

export interface ResumoQuestao {
  id: string;
  provaId: ProvaId;
  tipo: 'objetiva' | 'discursiva';
  numero: number;
  rotulo: string;
  parte: Parte;
  ordemCaderno: number;
  previa: string;
  /** RF14 */
  assuntos?: string[];
}

export interface IndiceProvas {
  provas: Prova[];
  questoes: ResumoQuestao[];
}

/** RF16: índice de acerto nacional (microdados do INEP), em %. */
export interface EstatisticaItem {
  anulada: boolean;
  acerto?: number;
  distribuicao: Partial<Record<Letra, number>>;
  brancoOuInvalida: number;
}

export interface EstatisticasProva {
  provaId: ProvaId;
  fonte: string;
  presentes: number;
  itens: Record<string, EstatisticaItem>;
}

export interface ProvaCompleta {
  prova: Prova;
  gabarito: Gabarito | null;
  textosBase: Record<string, TextoBase>;
  questoes: Questao[];
  resolucoes: Record<string, string>;
  estatisticas?: EstatisticasProva | null;
}

export interface FiltrosQuestoes {
  ano?: number | 'todos';
  provaId?: ProvaId | 'todas';
  parte?: Parte | 'todas';
  tipo?: 'objetiva' | 'discursiva' | 'todas';
  termo?: string;
  assunto?: string | 'todos';
}
