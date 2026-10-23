import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ProvaId, Gabarito, Letra } from '../../src/data/tipos';

const RAIZ = process.cwd();

export interface ComparacaoCegaResultado {
  provaId: string;
  total: number;
  iguais: number;
  diferentes: number;
  questoes: {
    questaoId: string;
    numero: number;
    respostaCega: Letra | string;
    gabarito: Letra | string;
    coincide: boolean;
    raciocinioCurto: string;
  }[];
}

export function executarComparacaoCega(provaId: ProvaId, raiz: string = RAIZ): ComparacaoCegaResultado {
  const cegoDir = path.resolve(raiz, 'work/cego', provaId);
  const gabaritoPath = path.resolve(raiz, 'content/provas', provaId, 'gabarito.json');

  if (!fs.existsSync(gabaritoPath)) {
    throw new Error(`Gabarito não encontrado para a prova ${provaId}: ${gabaritoPath}`);
  }

  const gabarito: Gabarito = JSON.parse(fs.readFileSync(gabaritoPath, 'utf-8'));
  const resultado: ComparacaoCegaResultado = {
    provaId,
    total: 0,
    iguais: 0,
    diferentes: 0,
    questoes: [],
  };

  if (!fs.existsSync(cegoDir)) {
    return resultado;
  }

  const arquivos = fs.readdirSync(cegoDir).filter((f) => f.endsWith('.json'));

  for (const arquivo of arquivos) {
    const filePath = path.join(cegoDir, arquivo);
    try {
      const dados = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const qId = dados.questaoId || arquivo.replace('.json', '');
      
      // Extrai número da questão (ex: "2025-prova1-q032" -> 32)
      const matchNum = qId.match(/q0*(\d+)/i) || qId.match(/d0*(\d+)/i);
      const numero = matchNum ? Number(matchNum[1]) : 0;
      const ehDiscursiva = qId.includes('-d');

      let letraGabarito: string = '—';
      if (!ehDiscursiva && gabarito.objetivas && gabarito.objetivas[String(numero)]) {
        letraGabarito = gabarito.objetivas[String(numero)];
      } else if (ehDiscursiva) {
        letraGabarito = '***';
      }

      const coincide = ehDiscursiva ? true : dados.respostaCega === letraGabarito;

      resultado.total += 1;
      if (coincide) {
        resultado.iguais += 1;
      } else {
        resultado.diferentes += 1;
      }

      resultado.questoes.push({
        questaoId: qId,
        numero,
        respostaCega: dados.respostaCega || '—',
        gabarito: letraGabarito,
        coincide,
        raciocinioCurto: dados.raciocinioCurto || '',
      });
    } catch (err) {
      console.error(`Erro ao ler arquivo cego ${filePath}:`, err);
    }
  }

  resultado.questoes.sort((a, b) => a.numero - b.numero);
  return resultado;
}

export function salvarRelatorioCego(resultado: ComparacaoCegaResultado, raiz: string = RAIZ): string {
  const relatoriosDir = path.resolve(raiz, 'work/relatorios');
  if (!fs.existsSync(relatoriosDir)) {
    fs.mkdirSync(relatoriosDir, { recursive: true });
  }

  const taxa = resultado.total > 0
    ? ((resultado.iguais / resultado.total) * 100).toFixed(1)
    : '0.0';

  let md = `# Relatório de Resolução Cega — ${resultado.provaId}\n\n`;
  md += `Data da execução: ${new Date().toISOString().split('T')[0]}\n`;
  md += `- Total de questões cegas avaliadas: **${resultado.total}**\n`;
  md += `- Coincidentes com gabarito: **${resultado.iguais}** (${taxa}%)\n`;
  md += `- Divergências identificadas: **${resultado.diferentes}**\n\n`;
  md += `| Questão | Resposta Cega | Gabarito Oficial | Coincide? | Raciocínio Curto |\n`;
  md += `|---|---|---|---|---|\n`;

  for (const q of resultado.questoes) {
    const status = q.coincide ? '✅ Sim' : '⚠️ Não';
    const raciocinio = q.raciocinioCurto.replace(/\|/g, '\\|');
    md += `| \`${q.questaoId}\` | **${q.respostaCega}** | **${q.gabarito}** | ${status} | ${raciocinio} |\n`;
  }

  const outPath = path.join(relatoriosDir, `cego-${resultado.provaId}.md`);
  fs.writeFileSync(outPath, md, 'utf-8');
  return outPath;
}

// Execução CLI
if (process.argv[1] && (process.argv[1].endsWith('comparar-cego.ts') || process.argv[1].endsWith('comparar-cego.js'))) {
  const args = process.argv.slice(2);
  const provaIdx = args.indexOf('--prova');
  const provaArg = provaIdx !== -1 ? (args[provaIdx + 1] as ProvaId) : undefined;

  const provasParaRodar: ProvaId[] = provaArg
    ? [provaArg]
    : ['2021-licenciatura', '2025-prova1', '2025-prova5', '2026-prova1'];

  for (const p of provasParaRodar) {
    const res = executarComparacaoCega(p);
    const relPath = salvarRelatorioCego(res);
    console.log(`[COMPARAR-CEGO] Prova ${p}: ${res.iguais}/${res.total} coincidentes. Relatório salvo em: ${relPath}`);
  }
}
