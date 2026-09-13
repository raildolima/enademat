import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

let entrada = '';
process.stdin.on('data', (parte) => (entrada += parte));
process.stdin.on('end', () => {
  if (!existsSync('scripts/content/validate.ts')) {
    process.exit(0);
  }

  // Busca caminhos com padrão content/...(.json ou .md)
  const regex = /(?:[A-Za-z]:[\\/][^\s"'`]+[\\/])?content[\\/][^\s"'`]+\.(?:json|md)/gi;
  const encontrados = [...new Set(entrada.match(regex) || [])];

  for (const caminho of encontrados) {
    try {
      execSync(`npx tsx scripts/content/validate.ts --arquivo "${caminho}"`, {
        stdio: 'inherit',
      });
    } catch (err) {
      console.error(`[HOOK VALIDAÇÃO FALHOU]: ${caminho}`);
      process.exit(1);
    }
  }

  process.exit(0);
});
