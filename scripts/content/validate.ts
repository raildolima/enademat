import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';
import {
  QuestaoSchema,
  TextoBaseSchema,
  ProvaSchema,
  GabaritoSchema,
  FigurasManifestSchema,
  ResolucaoObjetivaFrontmatterSchema,
  ResolucaoDiscursivaFrontmatterSchema,
  ProvaIdSchema,
  validarTextoRico,
} from './schema';
import { obterGabaritoReferencia } from './gabaritos-referencia';

const RAIZ = process.cwd();

// Especificação 0.13, item 2: contagem de questões por prova.
const CONTAGENS_ESPERADAS: Record<string, { objetivas: number; discursivas: number }> = {
  '2021-licenciatura': { objetivas: 35, discursivas: 5 },
  '2025-prova1': { objetivas: 80, discursivas: 1 },
  '2025-prova5': { objetivas: 80, discursivas: 1 },
};

function nomeBaseQuestao(tipo: string, numero: number): string {
  return tipo === 'discursiva' ? `d${String(numero).padStart(2, '0')}` : `q${String(numero).padStart(3, '0')}`;
}

function normalizarSrc(src: string): string {
  return src.startsWith('/') ? src.slice(1) : src;
}

function coletarSrcImagens(blocos: any, destino: Set<string>): void {
  if (Array.isArray(blocos)) {
    for (const b of blocos) coletarSrcImagens(b, destino);
  } else if (blocos && typeof blocos === 'object') {
    if (blocos.tipo === 'imagem' && typeof blocos.src === 'string') destino.add(normalizarSrc(blocos.src));
    for (const v of Object.values(blocos)) coletarSrcImagens(v, destino);
  }
}

export function validarImagemBloco(bloco: { src: string; alt: string }, raiz: string = RAIZ): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  if (!bloco.alt || bloco.alt.trim().length < 15) {
    erros.push(`alt da imagem "${bloco.src}" deve conter pelo menos 15 caracteres descritivos.`);
  }

  const caminhoRelativo = normalizarSrc(bloco.src);
  const caminhoPublico = path.resolve(raiz, 'public', caminhoRelativo);
  const caminhoDireto = path.resolve(raiz, caminhoRelativo);

  if (!fs.existsSync(caminhoPublico) && !fs.existsSync(caminhoDireto)) {
    erros.push(`Imagem inexistente: arquivo "${bloco.src}" não foi encontrado em public/.`);
  }

  return { valido: erros.length === 0, erros };
}

export function validarBlocosRecursivo(blocos: any[], raiz: string = RAIZ): string[] {
  const erros: string[] = [];
  for (const b of blocos) {
    if (b.tipo === 'imagem') {
      const resImg = validarImagemBloco(b, raiz);
      if (!resImg.valido) erros.push(...resImg.erros);
    } else if (b.tipo === 'quadro' && Array.isArray(b.blocos)) {
      erros.push(...validarBlocosRecursivo(b.blocos, raiz));
    }
  }
  return erros;
}

export function validarQuestaoObj(obj: any, raiz: string = RAIZ): { valido: boolean; erros: string[] } {
  const parsed = QuestaoSchema.safeParse(obj);
  const erros: string[] = [];

  if (!parsed.success) {
    erros.push(...parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }

  // Checagem de imagens em enunciado e alternativas
  if (obj.enunciado && Array.isArray(obj.enunciado)) {
    erros.push(...validarBlocosRecursivo(obj.enunciado, raiz));
  }
  if (obj.alternativas && Array.isArray(obj.alternativas)) {
    for (const alt of obj.alternativas) {
      if (alt.blocos && Array.isArray(alt.blocos)) {
        erros.push(...validarBlocosRecursivo(alt.blocos, raiz));
      }
    }
  }

  return { valido: erros.length === 0, erros };
}

export function validarGabaritoComReferencia(gabarito: any): { valido: boolean; erros: string[] } {
  const parsed = GabaritoSchema.safeParse(gabarito);
  const erros: string[] = [];

  if (!parsed.success) {
    erros.push(...parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }

  const ref = obterGabaritoReferencia(gabarito.provaId);
  if (Object.keys(ref).length > 0) {
    for (const [qNum, letraEsperada] of Object.entries(ref)) {
      const letraGabarito = gabarito.objetivas?.[qNum];
      if (!letraGabarito) {
        erros.push(`Gabarito sem a questão ${qNum} (referência "${letraEsperada}").`);
      } else if (letraGabarito !== letraEsperada) {
        erros.push(
          `Gabarito com divergência oficial na questão ${qNum}: cadastrado "${letraGabarito}" vs referência "${letraEsperada}".`
        );
      }
    }
    for (const qNum of Object.keys(gabarito.objetivas ?? {})) {
      if (!(qNum in ref)) {
        erros.push(`Gabarito contém a questão ${qNum} inexistente na referência.`);
      }
    }
  }

  return { valido: erros.length === 0, erros };
}

export function validarResolucaoMarkdown(
  mdRaw: string,
  gabaritoOficial: string,
  info: { provaId: string; numero: number; arquivoNome?: string },
  opts: { release?: boolean; raiz?: string } = {}
): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  const raiz = opts.raiz ?? RAIZ;

  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(mdRaw);
  } catch (err: any) {
    return { valido: false, erros: [`Erro ao analisar frontmatter da resolução: ${err?.message || err}`] };
  }

  const data = parsedMatter.data;
  const isDiscursiva =
    gabaritoOficial === 'discursiva' ||
    String(info.numero).startsWith('d') ||
    (info.arquivoNome && info.arquivoNome.startsWith('d')) ||
    (data?.questaoId && data.questaoId.includes('-d'));

  const schemaFrontmatter = isDiscursiva ? ResolucaoDiscursivaFrontmatterSchema : ResolucaoObjetivaFrontmatterSchema;
  const frontmatterParsed = schemaFrontmatter.safeParse(data);
  if (!frontmatterParsed.success) {
    erros.push(...frontmatterParsed.error.issues.map((i) => `frontmatter.${i.path.join('.')}: ${i.message}`));
  }

  // 0. questaoId coerente com o nome do arquivo
  if (info.arquivoNome) {
    const idEsperado = `${info.provaId}-${path.parse(info.arquivoNome).name}`;
    if (data.questaoId && data.questaoId !== idEsperado) {
      erros.push(`frontmatter.questaoId ("${data.questaoId}") incoerente com o arquivo (esperado "${idEsperado}").`);
    }
  }

  // 1. Checagem respostaFinal === gabaritoOficial
  if (data.respostaFinal && gabaritoOficial && data.respostaFinal !== gabaritoOficial) {
    erros.push(
      `Campo respostaFinal ("${data.respostaFinal}") difere do gabarito oficial ("${gabaritoOficial}"). O gabarito oficial nunca pode ser alterado.`
    );
  }

  // 2. Checagem respostaIndependente contra work/cego/<provaId>/<qNNN>.json, se existir.
  // Discursivas ficam de fora: a etapa cega registra texto livre, não comparável ao resumo do frontmatter.
  const nomeBase = info.arquivoNome ? path.parse(info.arquivoNome).name : `q${String(info.numero).padStart(3, '0')}`;
  const cegoFile = path.resolve(raiz, 'work/cego', info.provaId, `${nomeBase}.json`);
  if (!isDiscursiva && fs.existsSync(cegoFile)) {
    try {
      const cegoData = JSON.parse(fs.readFileSync(cegoFile, 'utf-8'));
      const respCega = cegoData.resposta || cegoData.respostaCega || cegoData.respostaIndependente;
      if (respCega && data.respostaIndependente !== respCega) {
        erros.push(
          `respostaIndependente ("${data.respostaIndependente}") diverge da resposta da etapa cega ("${respCega}") registrada em ${cegoFile}.`
        );
      }
    } catch (e: any) {
      erros.push(`Falha ao ler arquivo cego ${cegoFile}: ${e?.message}`);
    }
  }

  // 3. No release, toda resolução precisa estar aprovada (pendente e reprovada falham)
  if (opts.release && data.verificacao !== 'aprovada') {
    erros.push(
      `Modo --release exige verificacao: aprovada em todas as resoluções (encontrada "${data.verificacao}"; pendente ou reprovada não são aceitas).`
    );
  }

  // 4. Checagem de seções obrigatórias
  const corpo = parsedMatter.content;

  if (!isDiscursiva) {
    const secoesObrigatorias = [
      '## Ideia-chave',
      '## Resolução passo a passo',
      '## Análise das alternativas',
      '## Conceitos envolvidos',
    ];
    for (const sec of secoesObrigatorias) {
      if (!corpo.includes(sec)) {
        erros.push(`Seção obrigatória ausente na resolução: "${sec}".`);
      }
    }

    // Na análise das alternativas, checa se há itens para as letras
    if (corpo.includes('## Análise das alternativas')) {
      const letras = info.provaId === '2021-licenciatura' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
      for (const l of letras) {
        const regexLetra = new RegExp(`-\\s*\\*\\*${l}\\s*—`, 'i');
        if (!regexLetra.test(corpo)) {
          erros.push(`Análise da alternativa "${l}" ausente na seção ## Análise das alternativas.`);
        }
      }
    }
  } else {
    const secoesObrigatorias = [
      '## O que a questão pede',
      '## Resposta esperada',
      '## Critérios de avaliação',
      '## Exemplo de resposta',
      '## Conceitos e referências',
    ];
    for (const sec of secoesObrigatorias) {
      if (!corpo.includes(sec)) {
        erros.push(`Seção obrigatória ausente na resolução discursiva: "${sec}".`);
      }
    }
  }

  // 5. Validação de TextoRico e LaTeX no corpo
  const checagemTexto = validarTextoRico(corpo);
  if (!checagemTexto.valido) {
    erros.push(...checagemTexto.erros);
  }

  return { valido: erros.length === 0, erros };
}

export function executarValidacaoCompleta(opts: {
  provaId?: string;
  arquivo?: string;
  release?: boolean;
  raiz?: string;
} = {}): { valido: boolean; erros: string[] } {
  const raiz = opts.raiz ?? RAIZ;
  const todosErros: string[] = [];
  const provasConhecidas: readonly string[] = ProvaIdSchema.options;

  // Se passou arquivo específico
  if (opts.arquivo) {
    const filePath = path.resolve(raiz, opts.arquivo);
    if (!fs.existsSync(filePath)) {
      return { valido: false, erros: [`Arquivo não encontrado: ${opts.arquivo}`] };
    }

    const parts = path.relative(raiz, filePath).split(/[\\/]/);
    const noConteudo = parts[0] === 'content' && parts[1] === 'provas' && provasConhecidas.includes(parts[2]);
    const pId = noConteudo ? parts[2] : '';
    const sub = noConteudo ? parts.slice(3, -1).join('/') : '';
    const fName = path.basename(filePath);
    const naoReconhecido = `Tipo de arquivo não reconhecido pelo validador: ${opts.arquivo} (esperado arquivo de content/provas/<provaId>/).`;

    if (!noConteudo) {
      return { valido: false, erros: [naoReconhecido] };
    }

    if (fName.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (sub === '' && fName === 'gabarito.json') {
          const res = validarGabaritoComReferencia(content);
          if (!res.valido) todosErros.push(...res.erros);
        } else if (sub === '' && fName === 'prova.json') {
          const res = ProvaSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (sub === '' && fName === 'figuras.manifest.json') {
          const res = FigurasManifestSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (sub === 'textos-base') {
          const res = TextoBaseSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (sub === 'questoes') {
          const res = validarQuestaoObj(content, raiz);
          if (!res.valido) todosErros.push(...res.erros);
        } else {
          todosErros.push(naoReconhecido);
        }
      } catch (err: any) {
        todosErros.push(`JSON inválido em ${opts.arquivo}: ${err?.message}`);
      }
    } else if (fName.endsWith('.md') && sub === 'resolucoes') {
      const mdContent = fs.readFileSync(filePath, 'utf-8');
      const numMatch = fName.match(/^(?:q|d)(\d+)\.md$/);
      const num = numMatch ? parseInt(numMatch[1], 10) : 0;
      const isDisc = fName.startsWith('d');
      let letraGabarito = '';
      if (!isDisc) {
        const gabPath = path.resolve(raiz, 'content/provas', pId, 'gabarito.json');
        if (fs.existsSync(gabPath)) {
          const gData = JSON.parse(fs.readFileSync(gabPath, 'utf-8'));
          letraGabarito = gData?.objetivas?.[String(num)] || '';
        }
      }
      const res = validarResolucaoMarkdown(
        mdContent,
        letraGabarito,
        { provaId: pId, numero: num, arquivoNome: fName },
        { release: opts.release, raiz }
      );
      if (!res.valido) todosErros.push(...res.erros);
    } else {
      todosErros.push(naoReconhecido);
    }
    return { valido: todosErros.length === 0, erros: todosErros };
  }

  // Validação geral da pasta content/
  if (opts.provaId && !provasConhecidas.includes(opts.provaId)) {
    return {
      valido: false,
      erros: [`Prova inexistente: "${opts.provaId}". Valores aceitos: ${provasConhecidas.join(', ')}.`],
    };
  }
  const provas = opts.provaId ? [opts.provaId] : [...provasConhecidas];
  for (const p of provas) {
    const provaDir = path.resolve(raiz, 'content/provas', p);
    if (!fs.existsSync(provaDir)) {
      todosErros.push(`[${p}] Prova inexistente: pasta content/provas/${p} não encontrada.`);
      continue;
    }

    // 1. prova.json
    const provaFile = path.join(provaDir, 'prova.json');
    if (fs.existsSync(provaFile)) {
      const provaData = JSON.parse(fs.readFileSync(provaFile, 'utf-8'));
      const resProva = ProvaSchema.safeParse(provaData);
      if (!resProva.success) todosErros.push(...resProva.error.issues.map((i) => `[${p}/prova.json] ${i.message}`));
    } else {
      todosErros.push(`[${p}] prova.json ausente.`);
    }

    // 2. gabarito.json
    const gabaritoFile = path.join(provaDir, 'gabarito.json');
    let gabaritoData: any = null;
    if (fs.existsSync(gabaritoFile)) {
      gabaritoData = JSON.parse(fs.readFileSync(gabaritoFile, 'utf-8'));
      const resGab = validarGabaritoComReferencia(gabaritoData);
      if (!resGab.valido) todosErros.push(...resGab.erros.map((e) => `[${p}/gabarito.json] ${e}`));
    } else {
      todosErros.push(`[${p}] gabarito.json ausente.`);
    }

    // Imagens referenciadas no conteúdo (questões e textos-base), para conferir o manifesto
    const srcsUsados = new Set<string>();

    // 3. textos-base/*.json
    const textosBase = new Map<string, any>();
    const tbDir = path.join(provaDir, 'textos-base');
    if (fs.existsSync(tbDir)) {
      for (const f of fs.readdirSync(tbDir)) {
        if (!f.endsWith('.json')) continue;
        try {
          const tbData = JSON.parse(fs.readFileSync(path.join(tbDir, f), 'utf-8'));
          textosBase.set(tbData.id, tbData);
          const resTb = TextoBaseSchema.safeParse(tbData);
          if (!resTb.success) todosErros.push(...resTb.error.issues.map((i) => `[${p}/textos-base/${f}] ${i.message}`));
          if (tbData.blocos && Array.isArray(tbData.blocos)) {
            const errsImg = validarBlocosRecursivo(tbData.blocos, raiz);
            todosErros.push(...errsImg.map((e) => `[${p}/textos-base/${f}] ${e}`));
            coletarSrcImagens(tbData.blocos, srcsUsados);
          }
        } catch (err: any) {
          todosErros.push(`[${p}/textos-base/${f}] JSON inválido: ${err?.message}`);
        }
      }
    }

    // 4. questoes/*.json (objetivas e discursivas). A pasta legada questoes-discursivas/ é ignorada
    // pelo content:build, então sua presença é erro: o conteúdo dela não chegaria ao app.
    if (fs.existsSync(path.join(provaDir, 'questoes-discursivas'))) {
      todosErros.push(`[${p}] Pasta legada questoes-discursivas/ não é lida pelo build: mova os arquivos para questoes/.`);
    }
    const nomesQuestoes: string[] = [];
    let totalObjetivas = 0;
    let totalDiscursivas = 0;
    const sub = 'questoes';
    const qDir = path.join(provaDir, sub);
    const arquivosQuestoes = fs.existsSync(qDir) ? fs.readdirSync(qDir) : [];
    for (const f of arquivosQuestoes) {
      if (!f.endsWith('.json')) continue;
      const rotulo = `[${p}/${sub}/${f}]`;
      try {
        const qData = JSON.parse(fs.readFileSync(path.join(qDir, f), 'utf-8'));
        const resQ = validarQuestaoObj(qData, raiz);
        if (!resQ.valido) todosErros.push(...resQ.erros.map((e) => `${rotulo} ${e}`));
        coletarSrcImagens(qData, srcsUsados);

        if (qData.tipo === 'objetiva') totalObjetivas++;
        else if (qData.tipo === 'discursiva') totalDiscursivas++;

        // Coerência entre nome do arquivo, id, provaId, tipo e numero
        const base = nomeBaseQuestao(qData.tipo, qData.numero);
        if (f !== `${base}.json` || qData.id !== `${p}-${base}` || qData.provaId !== p) {
          todosErros.push(
            `${rotulo} id "${qData.id}", provaId "${qData.provaId}", tipo "${qData.tipo}" e numero ${qData.numero} incoerente com o arquivo (esperado id "${p}-${path.parse(f).name}").`
          );
        }
        nomesQuestoes.push(path.parse(f).name);

        // textoBaseId existe e o texto-base lista a questão
        if (qData.textoBaseId) {
          const tb = textosBase.get(qData.textoBaseId);
          if (!tb) {
            todosErros.push(`${rotulo} textoBaseId "${qData.textoBaseId}" não existe em textos-base/.`);
          } else if (!Array.isArray(tb.questoes) || !tb.questoes.includes(qData.numero)) {
            todosErros.push(`${rotulo} texto-base ${qData.textoBaseId} não lista a questão ${qData.numero}.`);
          }
        }
      } catch (err: any) {
        todosErros.push(`${rotulo} JSON inválido: ${err?.message}`);
      }
    }

    const esperado = CONTAGENS_ESPERADAS[p];
    if (esperado && (totalObjetivas !== esperado.objetivas || totalDiscursivas !== esperado.discursivas)) {
      todosErros.push(
        `[${p}] Contagem de questões: esperado ${esperado.objetivas} objetivas + ${esperado.discursivas} discursiva(s), encontrado ${totalObjetivas} + ${totalDiscursivas}.`
      );
    }

    // 5. figuras.manifest.json: schema, status ≠ pendente, sem órfãs e sem imagens fora do manifesto
    const manifestFile = path.join(provaDir, 'figuras.manifest.json');
    const srcsManifesto = new Set<string>();
    if (fs.existsSync(manifestFile)) {
      const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
      const resManifest = FigurasManifestSchema.safeParse(manifestData);
      if (!resManifest.success) todosErros.push(...resManifest.error.issues.map((i) => `[${p}/figuras.manifest.json] ${i.message}`));
      for (const fig of Array.isArray(manifestData.figuras) ? manifestData.figuras : []) {
        const src = `figuras/${p}/${fig.arquivo}`;
        srcsManifesto.add(src);
        if (fig.status === 'pendente') {
          todosErros.push(`[${p}/figuras.manifest.json] Figura ${fig.arquivo} com status "pendente".`);
        }
        if (!srcsUsados.has(src)) {
          todosErros.push(
            `[${p}/figuras.manifest.json] Figura órfã no manifesto: ${fig.arquivo} não é usada por nenhuma questão ou texto-base.`
          );
        }
      }
    }
    for (const src of srcsUsados) {
      if (src.startsWith(`figuras/${p}/`) && !srcsManifesto.has(src)) {
        todosErros.push(`[${p}] Imagem "${src}" não registrada em figuras.manifest.json.`);
      }
    }

    // 6. resolucoes/*.md: uma por questão, validadas individualmente
    const resDir = path.join(provaDir, 'resolucoes');
    for (const nome of nomesQuestoes) {
      if (!fs.existsSync(path.join(resDir, `${nome}.md`))) {
        todosErros.push(`[${p}] Resolução ausente para a questão ${p}-${nome} (esperado resolucoes/${nome}.md).`);
      }
    }
    if (fs.existsSync(resDir)) {
      for (const f of fs.readdirSync(resDir)) {
        if (!f.endsWith('.md')) continue;
        try {
          const mdContent = fs.readFileSync(path.join(resDir, f), 'utf-8');
          const numMatch = f.match(/^(?:q|d)(\d+)\.md$/);
          const num = numMatch ? parseInt(numMatch[1], 10) : 0;
          const isDisc = f.startsWith('d');
          const letraGabarito = isDisc ? '' : (gabaritoData?.objetivas?.[String(num)] || '');
          const resMd = validarResolucaoMarkdown(
            mdContent,
            letraGabarito,
            { provaId: p, numero: num, arquivoNome: f },
            { release: opts.release, raiz }
          );
          if (!resMd.valido) todosErros.push(...resMd.erros.map((e) => `[${p}/resolucoes/${f}] ${e}`));
        } catch (err: any) {
          todosErros.push(`[${p}/resolucoes/${f}] Erro: ${err?.message}`);
        }
      }
    }
  }

  return { valido: todosErros.length === 0, erros: todosErros };
}

// Execução CLI
if (process.argv[1] && (process.argv[1].endsWith('validate.ts') || process.argv[1].endsWith('validate.js'))) {
  const args = process.argv.slice(2);
  let provaId: string | undefined;
  let arquivo: string | undefined;
  let release = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--prova' && args[i + 1]) {
      provaId = args[i + 1];
      i++;
    } else if (args[i] === '--arquivo' && args[i + 1]) {
      arquivo = args[i + 1];
      i++;
    } else if (args[i] === '--release') {
      release = true;
    }
  }

  const res = executarValidacaoCompleta({ provaId, arquivo, release });
  if (!res.valido) {
    console.error('Erros de validação de conteúdo encontrados:');
    res.erros.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('Validação de conteúdo aprovada com sucesso!');
    process.exit(0);
  }
}
