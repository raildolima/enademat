import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

let entrada = '';
process.stdin.on('data', (parte) => (entrada += parte));
process.stdin.on('end', () => {
  const raiz = existsSync('scripts/content/validate.ts')
    ? process.cwd()
    : (existsSync('../scripts/content/validate.ts') ? path.resolve('..') : null);

  if (!raiz) {
    process.exit(0);
  }

  const validateScript = path.join(raiz, 'scripts/content/validate.ts');

  const regex = /(?:[A-Za-z]:[\/][^\s"'`]+[\/])?content[\/][^\s"'`*?:()]+\.(?:json|md)/gi;
  const encontrados = [...new Set(entrada.match(regex) || [])];

  for (let caminho of encontrados) {
    const caminhoAbsoluto = path.isAbsolute(caminho) ? caminho : path.join(raiz, caminho);
    if (!existsSync(caminhoAbsoluto)) {
      continue;
    }
    try {
      execSync(`npx tsx "${validateScript}" --arquivo "${caminhoAbsoluto}"`, {
        cwd: raiz,
        stdio: ['pipe', 'ignore', 'inherit'],
      });
    } catch (err) {
      console.error(`[HOOK VALIDAÇÃO FALHOU]: ${caminho}`);
      process.exit(1);
    }
  }

  process.exit(0);
});
