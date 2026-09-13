import { existsSync } from 'node:fs';

let entrada = '';
process.stdin.on('data', (parte) => (entrada += parte));
process.stdin.on('end', () => {
  const texto = entrada.toLowerCase();
  let saida = { decision: 'allow' };
  if (/git\s+push|gh\s+repo\s+create|netlify\s+deploy|vercel\s+(deploy|--prod)/.test(texto)) {
    saida = { decision: 'ask', reason: 'Push/publicação exige autorização do usuário.' };
  } else if (texto.includes('gabarito.json') && (existsSync('work/cego/BLOQUEIO') || existsSync('../work/cego/BLOQUEIO'))) {
    saida = { decision: 'deny', reason: 'Etapa cega em andamento: gabarito indisponível.' };
  }
  process.stdout.write(JSON.stringify(saida));
});
