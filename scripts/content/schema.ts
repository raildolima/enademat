import { z } from 'zod';
import katex from 'katex';

export const ProvaIdSchema = z.enum(['2021-licenciatura', '2025-prova1', '2025-prova5']);
export const LetraSchema = z.enum(['A', 'B', 'C', 'D', 'E']);
export const ParteSchema = z.enum(['formacao-geral', 'componente-especifico']);
export const TipoQuestaoSchema = z.enum(['objetiva', 'discursiva']);

export function validarLatex(latex: string, displayMode = false): { valido: boolean; erros: string[] } {
  try {
    katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      strict: false,
    });
    return { valido: true, erros: [] };
  } catch (err: any) {
    return { valido: false, erros: [`Erro de compilação KaTeX no LaTeX "${latex}": ${err?.message || err}`] };
  }
}

export function validarTextoRico(texto: string): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  // Checagem de R$ sem barra como moeda: procura "R$" não precedido por \ seguido de espaço e/ou dígitos
  const regexRealInvalido = /(?<!\\)R\$\s*\d/g;
  if (regexRealInvalido.test(texto)) {
    erros.push('Símbolo monetário "R$" sem barra invertida detectado. Deve ser sempre "R\\$".');
  }

  // Checagem de HTML cru proibido (ex: <div, <span, <p, etc.)
  const regexHtml = /<\/?(?:div|span|p|a|b|i|strong|em|table|tr|td|th|br|hr)[^>]*>/i;
  if (regexHtml.test(texto)) {
    erros.push('HTML cru não permitido no TextoRico.');
  }

  // Placeholders proibidos (TODO, TBD, PREENCHER devem ser maiúsculos para não colidir com o português "todo")
  const termosCaseSensitive = ['\\bTODO\\b', '\\bTBD\\b', '\\bPREENCHER\\b'];
  for (const termo of termosCaseSensitive) {
    if (new RegExp(termo).test(texto)) {
      erros.push(`Placeholder ou termo proibido detectado: ${termo}`);
    }
  }
  const termosCaseInsensitive = ['\\[incerto\\]', '\\blorem\\b'];
  for (const termo of termosCaseInsensitive) {
    if (new RegExp(termo, 'i').test(texto)) {
      erros.push(`Placeholder ou termo proibido detectado: ${termo}`);
    }
  }

  // Validação de LaTeX display: $$...$$
  const regexDisplayMath = /\$\$([\s\S]+?)\$\$/g;
  let matchDisplay: RegExpExecArray | null;
  while ((matchDisplay = regexDisplayMath.exec(texto)) !== null) {
    const mathContent = matchDisplay[1].trim();
    const checagemMath = validarLatex(mathContent, true);
    if (!checagemMath.valido) {
      erros.push(...checagemMath.erros);
    }
  }

  // Remove os blocos display para não colidir com a validação inline
  const textoSemDisplay = texto.replace(regexDisplayMath, ' ');

  // Validação de LaTeX inline: $...$
  // Procura fórmulas inline entre $...$, ignorando \$ escapado
  const regexInlineMath = /(?<!\\)\$(.+?)(?<!\\)\$/g;
  let match: RegExpExecArray | null;
  while ((match = regexInlineMath.exec(textoSemDisplay)) !== null) {
    const mathContent = match[1].trim();
    const checagemMath = validarLatex(mathContent, false);
    if (!checagemMath.valido) {
      erros.push(...checagemMath.erros);
    }
  }

  return { valido: erros.length === 0, erros };
}

export const TextoRicoSchema = z.string().superRefine((val, ctx) => {
  const res = validarTextoRico(val);
  if (!res.valido) {
    res.erros.forEach((err) => ctx.addIssue({ code: z.ZodIssueCode.custom, message: err }));
  }
});

// Bloco com recursão via z.lazy
export const BlocoSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion('tipo', [
    z.object({
      tipo: z.literal('titulo'),
      texto: TextoRicoSchema,
    }),
    z.object({
      tipo: z.literal('paragrafo'),
      texto: TextoRicoSchema,
    }),
    z.object({
      tipo: z.literal('formula'),
      latex: z.string().superRefine((val, ctx) => {
        const res = validarLatex(val, true);
        if (!res.valido) {
          res.erros.forEach((err) => ctx.addIssue({ code: z.ZodIssueCode.custom, message: err }));
        }
      }),
    }),
    z.object({
      tipo: z.literal('lista'),
      ordenada: z.boolean(),
      itens: z.array(TextoRicoSchema),
    }),
    z.object({
      tipo: z.literal('afirmativas'),
      itens: z.array(
        z.object({
          rotulo: z.enum(['I', 'II', 'III', 'IV', 'V']),
          texto: TextoRicoSchema,
        })
      ),
    }),
    z.object({
      tipo: z.literal('conectivo'),
      texto: z.literal('PORQUE'),
    }),
    z.object({
      tipo: z.literal('tabela'),
      cabecalho: z.array(TextoRicoSchema).optional(),
      linhas: z.array(z.array(TextoRicoSchema)),
      legenda: TextoRicoSchema.optional(),
    }),
    z.object({
      tipo: z.literal('imagem'),
      src: z.string().min(1, 'src da imagem obrigatório'),
      alt: z.string().min(15, 'alt da imagem deve conter pelo menos 15 caracteres descritivos'),
      legenda: TextoRicoSchema.optional(),
      larguraMaxPx: z.number().positive().optional(),
    }),
    z.object({
      tipo: z.literal('quadro'),
      blocos: z.array(BlocoSchema),
    }),
    z.object({
      tipo: z.literal('fonte'),
      texto: TextoRicoSchema,
    }),
  ])
);

export function validarBloco(bloco: any): { valido: boolean; erros: string[] } {
  const parsed = BlocoSchema.safeParse(bloco);
  if (!parsed.success) {
    return { valido: false, erros: parsed.error.issues.map((i) => i.message) };
  }
  return { valido: true, erros: [] };
}

export const ProvaSchema = z.object({
  id: ProvaIdSchema,
  ano: z.union([z.literal(2021), z.literal(2025)]),
  ordem: z.number().int().positive(),
  titulo: z.string().min(3),
  subtitulo: z.string().min(3),
  arquivoProva: z.string().min(3),
  arquivoGabarito: z.string().min(3),
  alternativasPorQuestao: z.union([z.literal(4), z.literal(5)]),
  linhasDiscursiva: z.union([z.literal(15), z.literal(30)]),
});

export const TextoBaseSchema = z.object({
  id: z.string().regex(/^tb-\d{2}-\d{2}$/, 'id do texto base deve seguir o padrão tb-XX-YY'),
  provaId: ProvaIdSchema,
  titulo: z.string().min(3),
  questoes: z.array(z.number().int().positive()).min(1),
  blocos: z.array(BlocoSchema).min(1),
});

export const AlternativaSchema = z.object({
  letra: LetraSchema,
  blocos: z.array(BlocoSchema).min(1),
});

export const QuestaoSchema = z
  .object({
    id: z.string().min(3),
    provaId: ProvaIdSchema,
    tipo: TipoQuestaoSchema,
    numero: z.number().int().positive(),
    rotulo: z.string().min(3),
    parte: ParteSchema,
    ordemCaderno: z.number().int().positive(),
    paginas: z.array(z.number().int().positive()).min(1),
    textoBaseId: z.string().optional(),
    enunciado: z.array(BlocoSchema).min(1),
    alternativas: z.array(AlternativaSchema).optional(),
    itens: z
      .array(
        z.object({
          rotulo: z.string(),
          texto: TextoRicoSchema,
          valor: z.string().optional(),
        })
      )
      .optional(),
    notaEditorial: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    if (q.tipo === 'objetiva') {
      if (!q.alternativas || q.alternativas.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Questões objetivas devem conter a lista de alternativas.',
        });
        return;
      }
      const esperadas = q.provaId === '2021-licenciatura' ? 5 : 4;
      if (q.alternativas.length !== esperadas) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Questão objetiva da prova ${q.provaId} deve conter exatamente ${esperadas} alternativas, mas contém ${q.alternativas.length}.`,
        });
      }
      // Checa se as letras estão em ordem alfabética (A, B, C, D...)
      const letras = q.alternativas.map((a) => a.letra);
      const ordemEsperada = ['A', 'B', 'C', 'D', 'E'].slice(0, esperadas);
      if (letras.join('') !== ordemEsperada.join('')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Letras das alternativas fora de ordem alfabética: esperado ${ordemEsperada.join(', ')}, obtido ${letras.join(', ')}.`,
        });
      }
    }
  });

export const GabaritoSchema = z.object({
  provaId: ProvaIdSchema,
  fonte: z.string(),
  objetivas: z.record(z.string(), LetraSchema),
  discursivas: z.array(z.string()),
});

export const FigurasManifestSchema = z.object({
  provaId: ProvaIdSchema,
  figuras: z.array(
    z.object({
      arquivo: z.string(),
      pagina: z.number().int().positive(),
      bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
      dpi: z.number().int().default(220),
      uso: z.object({
        questaoId: z.string(),
        papel: z.enum(['enunciado', 'texto-base', 'alternativa']),
        letra: LetraSchema.optional(),
      }),
      status: z.enum(['pendente', 'aprovado', 'revisao-humana']),
    })
  ),
});

export const ResolucaoFrontmatterSchema = z.object({
  questaoId: z.string(),
  respostaIndependente: z.string(),
  respostaFinal: z.string(),
  verificacao: z.enum(['pendente', 'aprovada', 'reprovada']),
  revisaoHumana: z.boolean(),
  checagemNumerica: z.string().optional(),
});

export type Prova = z.infer<typeof ProvaSchema>;
export type TextoBase = z.infer<typeof TextoBaseSchema>;
export type Questao = z.infer<typeof QuestaoSchema>;
export type Gabarito = z.infer<typeof GabaritoSchema>;
export type FigurasManifest = z.infer<typeof FigurasManifestSchema>;
export type ResolucaoFrontmatter = z.infer<typeof ResolucaoFrontmatterSchema>;
