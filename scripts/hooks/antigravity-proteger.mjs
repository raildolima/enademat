import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// O hook pode rodar com cwd na raiz ou em .agents/ (hooks.json usa "../scripts/hooks/...").
const MARCAS_BLOQUEIO = ['work/cego/BLOQUEIO', '../work/cego/BLOQUEIO'];

export function executar() {
  let entrada = '';
  process.stdin.on('data', (parte) => (entrada += parte));
  process.stdin.on('end', () => {
    const texto = entrada.toLowerCase();
    let saida = { decision: 'allow' };
    if (/git\s+push|gh\s+repo\s+create|netlify\s+deploy|vercel\s+(deploy|--prod)/.test(texto)) {
      saida = { decision: 'ask', reason: 'Push/publicação exige autorização do usuário.' };
    } else if (texto.includes('gabarito.json') && MARCAS_BLOQUEIO.some((marca) => existsSync(marca))) {
      saida = { decision: 'deny', reason: 'Etapa cega em andamento: gabarito indisponível.' };
    }
    process.stdout.write(JSON.stringify(saida));
  });
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  executar();
}
