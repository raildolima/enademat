import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';
import {
  QuestaoSchema,
  TextoBaseSchema,
  ProvaSchema,
  GabaritoSchema,
  FigurasManifestSchema,
  ResolucaoFrontmatterSchema,
  validarTextoRico,
  validarLatex,
} from './schema';
import { obterGabaritoReferencia } from './gabaritos-referencia';

const RAIZ = process.cwd();

export function validarImagemBloco(bloco: { src: string; alt: string }): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  if (!bloco.alt || bloco.alt.trim().length < 15) {
    erros.push(`alt da imagem "${bloco.src}" deve conter pelo menos 15 caracteres descritivos.`);
  }

  // Remove barra inicial se houver
  const caminhoRelativo = bloco.src.startsWith('/') ? bloco.src.slice(1) : bloco.src;
  const caminhoPublico = path.resolve(RAIZ, 'public', caminhoRelativo);
  const caminhoDireto = path.resolve(RAIZ, caminhoRelativo);

  if (!fs.existsSync(caminhoPublico) && !fs.existsSync(caminhoDireto)) {
    erros.push(`Imagem inexistente: arquivo "${bloco.src}" não foi encontrado em public/.`);
  }

  return { valido: erros.length === 0, erros };
}

export function validarBlocosRecursivo(blocos: any[]): string[] {
  const erros: string[] = [];
  for (const b of blocos) {
    if (b.tipo === 'imagem') {
      const resImg = validarImagemBloco(b);
      if (!resImg.valido) erros.push(...resImg.erros);
    } else if (b.tipo === 'quadro' && Array.isArray(b.blocos)) {
      erros.push(...validarBlocosRecursivo(b.blocos));
    }
  }
  return erros;
}

export function validarQuestaoObj(obj: any): { valido: boolean; erros: string[] } {
  const parsed = QuestaoSchema.safeParse(obj);
  const erros: string[] = [];

  if (!parsed.success) {
    erros.push(...parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }

  // Checagem de imagens em enunciado e alternativas
  if (obj.enunciado && Array.isArray(obj.enunciado)) {
    erros.push(...validarBlocosRecursivo(obj.enunciado));
  }
  if (obj.alternativas && Array.isArray(obj.alternativas)) {
    for (const alt of obj.alternativas) {
      if (alt.blocos && Array.isArray(alt.blocos)) {
        erros.push(...validarBlocosRecursivo(alt.blocos));
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
      if (letraGabarito && letraGabarito !== letraEsperada) {
        erros.push(
          `Gabarito com divergência oficial na questão ${qNum}: cadastrado "${letraGabarito}" vs referência "${letraEsperada}".`
        );
      }
    }
  }

  return { valido: erros.length === 0, erros };
}

export function validarResolucaoMarkdown(
  mdRaw: string,
  gabaritoOficial: string,
  info: { provaId: string; numero: number; arquivoNome?: string },
  opts: { release?: boolean } = {}
): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(mdRaw);
  } catch (err: any) {
    return { valido: false, erros: [`Erro ao analisar frontmatter da resolução: ${err?.message || err}`] };
  }

  const frontmatterParsed = ResolucaoFrontmatterSchema.safeParse(parsedMatter.data);
  if (!frontmatterParsed.success) {
    erros.push(...frontmatterParsed.error.issues.map((i) => `frontmatter.${i.path.join('.')}: ${i.message}`));
  }

  const data = parsedMatter.data;

  // 1. Checagem respostaFinal === gabaritoOficial
  if (data.respostaFinal && gabaritoOficial && data.respostaFinal !== gabaritoOficial) {
    erros.push(
      `Campo respostaFinal ("${data.respostaFinal}") difere do gabarito oficial ("${gabaritoOficial}"). O gabarito oficial nunca pode ser alterado.`
    );
  }

  // 2. Checagem respostaIndependente contra work/cego se existir
  const arquivoBase = info.arquivoNome || `q${String(info.numero).padStart(3, '0')}.json`;
  const cegoFile = path.resolve(RAIZ, 'work/cego', info.provaId, arquivoBase);
  if (fs.existsSync(cegoFile)) {
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

  // 3. Checagem de verificação pendente no release
  if (opts.release && data.verificacao === 'pendente') {
    erros.push('Modo --release exige verificacao: aprovada em todas as resoluções (encontrada resolução pendente).');
  }

  // 4. Checagem de seções obrigatórias
  const corpo = parsedMatter.content;
  const isDiscursiva = gabaritoOficial === 'discursiva' || String(info.numero).startsWith('d');

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
} = {}): { valido: boolean; erros: string[] } {
  const todosErros: string[] = [];

  // Se passou arquivo específico
  if (opts.arquivo) {
    const filePath = path.resolve(RAIZ, opts.arquivo);
    if (!fs.existsSync(filePath)) {
      return { valido: false, erros: [`Arquivo não encontrado: ${opts.arquivo}`] };
    }

    if (opts.arquivo.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (opts.arquivo.includes('gabarito.json')) {
          const res = validarGabaritoComReferencia(content);
          if (!res.valido) todosErros.push(...res.erros);
        } else if (opts.arquivo.includes('prova.json')) {
          const res = ProvaSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (opts.arquivo.includes('figuras.manifest.json')) {
          const res = FigurasManifestSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (opts.arquivo.includes('textos-base')) {
          const res = TextoBaseSchema.safeParse(content);
          if (!res.success) todosErros.push(...res.error.issues.map((i) => i.message));
        } else if (opts.arquivo.includes('questoes')) {
          const res = validarQuestaoObj(content);
          if (!res.valido) todosErros.push(...res.erros);
        }
      } catch (err: any) {
        todosErros.push(`JSON inválido em ${opts.arquivo}: ${err?.message}`);
      }
    } else if (opts.arquivo.endsWith('.md')) {
      const mdContent = fs.readFileSync(filePath, 'utf-8');
      const res = validarResolucaoMarkdown(
        mdContent,
        '',
        { provaId: '2025-prova1', numero: 0, arquivoNome: path.basename(filePath) },
        { release: opts.release }
      );
      if (!res.valido) todosErros.push(...res.erros);
    }
    return { valido: todosErros.length === 0, erros: todosErros };
  }

  // Validação geral da pasta content/
  const provas = opts.provaId ? [opts.provaId] : ['2021-licenciatura', '2025-prova1', '2025-prova5'];
  for (const p of provas) {
    const provaDir = path.resolve(RAIZ, 'content/provas', p);
    if (!fs.existsSync(provaDir)) continue;

    // 1. prova.json
    const provaFile = path.join(provaDir, 'prova.json');
    if (fs.existsSync(provaFile)) {
      const provaData = JSON.parse(fs.readFileSync(provaFile, 'utf-8'));
      const resProva = ProvaSchema.safeParse(provaData);
      if (!resProva.success) todosErros.push(...resProva.error.issues.map((i) => `[${p}/prova.json] ${i.message}`));
    }

    // 2. gabarito.json
    const gabaritoFile = path.join(provaDir, 'gabarito.json');
    let gabaritoData: any = null;
    if (fs.existsSync(gabaritoFile)) {
      gabaritoData = JSON.parse(fs.readFileSync(gabaritoFile, 'utf-8'));
      const resGab = validarGabaritoComReferencia(gabaritoData);
      if (!resGab.valido) todosErros.push(...resGab.erros.map((e) => `[${p}/gabarito.json] ${e}`));
    }

    // 3. figuras.manifest.json
    const manifestFile = path.join(provaDir, 'figuras.manifest.json');
    if (fs.existsSync(manifestFile)) {
      const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
      const resManifest = FigurasManifestSchema.safeParse(manifestData);
      if (!resManifest.success) todosErros.push(...resManifest.error.issues.map((i) => `[${p}/figuras.manifest.json] ${i.message}`));
    }

    // 4. textos-base/*.json
    const tbDir = path.join(provaDir, 'textos-base');
    if (fs.existsSync(tbDir)) {
      for (const f of fs.readdirSync(tbDir)) {
        if (!f.endsWith('.json')) continue;
        try {
          const tbData = JSON.parse(fs.readFileSync(path.join(tbDir, f), 'utf-8'));
          const resTb = TextoBaseSchema.safeParse(tbData);
          if (!resTb.success) todosErros.push(...resTb.error.issues.map((i) => `[${p}/textos-base/${f}] ${i.message}`));
          if (tbData.blocos && Array.isArray(tbData.blocos)) {
            const errsImg = validarBlocosRecursivo(tbData.blocos);
            todosErros.push(...errsImg.map((e) => `[${p}/textos-base/${f}] ${e}`));
          }
        } catch (err: any) {
          todosErros.push(`[${p}/textos-base/${f}] JSON inválido: ${err?.message}`);
        }
      }
    }

    // 5. questoes/*.json e questoes-discursivas/*.json
    for (const sub of ['questoes', 'questoes-discursivas']) {
      const qDir = path.join(provaDir, sub);
      if (!fs.existsSync(qDir)) continue;
      for (const f of fs.readdirSync(qDir)) {
        if (!f.endsWith('.json')) continue;
        try {
          const qData = JSON.parse(fs.readFileSync(path.join(qDir, f), 'utf-8'));
          const resQ = validarQuestaoObj(qData);
          if (!resQ.valido) todosErros.push(...resQ.erros.map((e) => `[${p}/${sub}/${f}] ${e}`));
        } catch (err: any) {
          todosErros.push(`[${p}/${sub}/${f}] JSON inválido: ${err?.message}`);
        }
      }
    }

    // 6. resolucoes/*.md
    const resDir = path.join(provaDir, 'resolucoes');
    if (fs.existsSync(resDir)) {
      for (const f of fs.readdirSync(resDir)) {
        if (!f.endsWith('.md')) continue;
        try {
          const mdContent = fs.readFileSync(path.join(resDir, f), 'utf-8');
          const numMatch = f.match(/^(?:q|d)(\d+)\.md$/);
          const num = numMatch ? parseInt(numMatch[1], 10) : 0;
          const letraGabarito = gabaritoData?.objetivas?.[String(num)] || '';
          const resMd = validarResolucaoMarkdown(
            mdContent,
            letraGabarito,
            { provaId: p, numero: num, arquivoNome: f },
            { release: opts.release }
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
