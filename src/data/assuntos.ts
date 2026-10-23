/** Vocabulário fechado de assuntos (RF14), aprovado pelo usuário em 2026-10-22. */
export const ASSUNTOS = [
  { id: 'aritmetica-numeros', rotulo: 'Aritmética e Teoria dos Números', grupo: 'Matemática' },
  { id: 'algebra-polinomios', rotulo: 'Álgebra e Polinômios', grupo: 'Matemática' },
  { id: 'algebra-linear', rotulo: 'Álgebra Linear e Matrizes', grupo: 'Matemática' },
  { id: 'funcoes-calculo', rotulo: 'Funções e Cálculo Diferencial e Integral', grupo: 'Matemática' },
  { id: 'analise-real', rotulo: 'Análise Real', grupo: 'Matemática' },
  { id: 'geometria', rotulo: 'Geometria Plana e Espacial', grupo: 'Matemática' },
  { id: 'geometria-analitica', rotulo: 'Geometria Analítica e Vetores', grupo: 'Matemática' },
  { id: 'trigonometria', rotulo: 'Trigonometria', grupo: 'Matemática' },
  { id: 'combinatoria-probabilidade', rotulo: 'Combinatória e Probabilidade', grupo: 'Matemática' },
  { id: 'estatistica', rotulo: 'Estatística', grupo: 'Matemática' },
  { id: 'matematica-financeira', rotulo: 'Matemática Financeira', grupo: 'Matemática' },
  { id: 'logica-conjuntos-algoritmos', rotulo: 'Lógica, Conjuntos e Algoritmos', grupo: 'Matemática' },
  { id: 'historia-matematica', rotulo: 'História da Matemática', grupo: 'Matemática' },
  {
    id: 'tendencias-educacao-matematica',
    rotulo: 'Tendências em Educação Matemática',
    grupo: 'Educação Matemática',
  },
  { id: 'analise-erros-saberes', rotulo: 'Análise de erros e saberes docentes', grupo: 'Educação Matemática' },
  { id: 'tecnologias-ensino', rotulo: 'Tecnologias digitais no ensino', grupo: 'Educação Matemática' },
  { id: 'inclusiva-eja', rotulo: 'Educação Matemática Inclusiva e EJA', grupo: 'Educação Matemática' },
  { id: 'curriculo-bncc', rotulo: 'Currículo e BNCC', grupo: 'Educação Matemática' },
  { id: 'politicas-gestao', rotulo: 'Políticas, legislação e gestão educacional', grupo: 'Formação Geral' },
  {
    id: 'diversidade-direitos',
    rotulo: 'Diversidade, direitos humanos, relações étnico-raciais e de gênero',
    grupo: 'Formação Geral',
  },
  { id: 'meio-ambiente', rotulo: 'Meio ambiente e sustentabilidade', grupo: 'Formação Geral' },
  { id: 'didatica-avaliacao', rotulo: 'Didática, avaliação e formação docente', grupo: 'Formação Geral' },
  { id: 'cultura-linguagens', rotulo: 'Cultura, linguagens e leitura', grupo: 'Formação Geral' },
] as const;

export type AssuntoId = (typeof ASSUNTOS)[number]['id'];

export const IDS_ASSUNTOS: readonly AssuntoId[] = ASSUNTOS.map((a) => a.id);

const ROTULOS = new Map<string, string>(ASSUNTOS.map((a) => [a.id, a.rotulo]));

export function rotuloAssunto(id: string): string {
  return ROTULOS.get(id) ?? id;
}
