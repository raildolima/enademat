import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Trecho "content/.../arquivo.json|md" com separadores / ou \ (inclusive \\ vindo de JSON escapado).
// O prefixo absoluto é ignorado: o caminho é resolvido a partir da raiz do projeto, o que também
// cobre pastas com espaço no nome (ex.: "Enade_simulador - CLAUDE").
const REGEX_CONTEUDO = /content(?:[\\/]+[^\s"'`*?:()<>|\\/]+)+\.(?:json|md)/gi;

/** Caminhos de content/ citados na entrada do hook, relativos à raiz e com "/". */
export function extrairCaminhosConteudo(entrada) {
  const caminhos = (entrada.match(REGEX_CONTEUDO) || []).map((c) => c.split(/[\\/]+/).join('/'));
  return [...new Set(caminhos)];
}

export function executar() {
  let entrada = '';
  process.stdin.on('data', (parte) => (entrada += parte));
  process.stdin.on('end', () => {
    const raiz = existsSync('scripts/content/validate.ts')
      ? process.cwd()
      : existsSync('../scripts/content/validate.ts')
        ? path.resolve('..')
        : null;

    if (!raiz) {
      process.exit(0);
    }

    const validateScript = path.join(raiz, 'scripts/content/validate.ts');

    for (const caminho of extrairCaminhosConteudo(entrada)) {
      const caminhoAbsoluto = path.join(raiz, caminho);
      if (!existsSync(caminhoAbsoluto)) {
        continue;
      }
      try {
        execSync(`npx tsx "${validateScript}" --arquivo "${caminho}"`, {
          cwd: raiz,
          stdio: ['pipe', 'ignore', 'inherit'],
        });
      } catch {
        console.error(`[HOOK VALIDAÇÃO FALHOU]: ${caminho}`);
        process.exit(1);
      }
    }

    process.exit(0);
  });
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  executar();
}
