import * as fs from 'node:fs';
import * as path from 'node:path';
import { imageSize } from 'image-size';
import { Prova, ResumoQuestao, IndiceProvas } from '../../src/data/tipos';

const RAIZ = process.cwd();
const CONTENT_DIR = path.resolve(RAIZ, 'content/provas');
const OUT_DIR = path.resolve(RAIZ, 'src/data/generated');

export function extrairPrevia(enunciado: any[]): string {
  if (!enunciado || !Array.isArray(enunciado) || enunciado.length === 0) return '';
  for (const b of enunciado) {
    if (b.tipo === 'paragrafo' && typeof b.texto === 'string') {
      // Limpa LaTeX básico ou reduz a ~140 caracteres
      const limpo = b.texto.replace(/\$([^$]+)\$/g, '$1').replace(/\\([a-zA-Z]+)/g, '$1');
      return limpo.length > 140 ? limpo.slice(0, 137) + '...' : limpo;
    }
  }
  return '';
}

export function compilarConteudo(opts: { dryRun?: boolean } = {}): {
  indice: IndiceProvas;
  provas: Record<string, any>;
} {
  const provasMeta: Prova[] = [];
  const resumosQuestoes: ResumoQuestao[] = [];
  const dadosPorProva: Record<string, any> = {};

  const provasIds = ['2021-licenciatura', '2025-prova1', '2025-prova5'];

  for (const provaId of provasIds) {
    const provaDir = path.join(CONTENT_DIR, provaId);
    if (!fs.existsSync(provaDir)) continue;

    const provaJsonPath = path.join(provaDir, 'prova.json');
    if (!fs.existsSync(provaJsonPath)) continue;

    const provaMeta: Prova = JSON.parse(fs.readFileSync(provaJsonPath, 'utf-8'));
    provasMeta.push(provaMeta);

    // Gabarito
    const gabaritoPath = path.join(provaDir, 'gabarito.json');
    const gabarito = fs.existsSync(gabaritoPath) ? JSON.parse(fs.readFileSync(gabaritoPath, 'utf-8')) : null;

    // Textos-base
    const textosBaseDir = path.join(provaDir, 'textos-base');
    const textosBase: Record<string, any> = {};
    if (fs.existsSync(textosBaseDir)) {
      for (const file of fs.readdirSync(textosBaseDir)) {
        if (file.endsWith('.json')) {
          const tb = JSON.parse(fs.readFileSync(path.join(textosBaseDir, file), 'utf-8'));
          textosBase[tb.id] = tb;
        }
      }
    }

    // Questões
    const questoesDir = path.join(provaDir, 'questoes');
    const questoes: any[] = [];
    if (fs.existsSync(questoesDir)) {
      for (const file of fs.readdirSync(questoesDir)) {
        if (file.endsWith('.json')) {
          const q = JSON.parse(fs.readFileSync(path.join(questoesDir, file), 'utf-8'));
          questoes.push(q);

          resumosQuestoes.push({
            id: q.id,
            provaId: q.provaId,
            tipo: q.tipo,
            numero: q.numero,
            rotulo: q.rotulo,
            parte: q.parte,
            ordemCaderno: q.ordemCaderno,
            previa: extrairPrevia(q.enunciado),
          });
        }
      }
      questoes.sort((a, b) => a.ordemCaderno - b.ordemCaderno);
    }

    // Resoluções
    const resolucoesDir = path.join(provaDir, 'resolucoes');
    const resolucoes: Record<string, string> = {};
    if (fs.existsSync(resolucoesDir)) {
      for (const file of fs.readdirSync(resolucoesDir)) {
        if (file.endsWith('.md')) {
          const qId = file.replace('.md', '');
          resolucoes[qId] = fs.readFileSync(path.join(resolucoesDir, file), 'utf-8');
        }
      }
    }

    dadosPorProva[provaId] = {
      prova: provaMeta,
      gabarito,
      textosBase,
      questoes,
      resolucoes,
    };
  }

  // Ordena resumo de questões por ordem da prova e ordemCaderno
  resumosQuestoes.sort((a, b) => {
    if (a.provaId !== b.provaId) {
      return a.provaId.localeCompare(b.provaId);
    }
    return a.ordemCaderno - b.ordemCaderno;
  });

  const indice: IndiceProvas = {
    provas: provasMeta,
    questoes: resumosQuestoes,
  };

  if (!opts.dryRun) {
    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(OUT_DIR, 'indice.json'), JSON.stringify(indice, null, 2), 'utf-8');

    for (const [provaId, dados] of Object.entries(dadosPorProva)) {
      fs.writeFileSync(path.join(OUT_DIR, `${provaId}.json`), JSON.stringify(dados, null, 2), 'utf-8');
    }
    console.log(`[BUILD] Build de conteúdo concluído com sucesso em ${OUT_DIR}!`);
  }

  return { indice, provas: dadosPorProva };
}

// Execução CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  compilarConteudo();
}
