/**
 * Monta o site do GitHub Pages em site/: a página de apresentação (pagina/) na raiz,
 * as fontes dela (copiadas do @fontsource) e o simulador já construído (dist/) em site/app/.
 * Uso: npm run build && npm run pagina:montar
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const destino = join(raiz, 'site');
const dist = join(raiz, 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html não existe. Rode "npm run build" antes.');
  process.exit(1);
}

const fontes = [
  '@fontsource/poppins/files/poppins-latin-700-normal.woff2',
  '@fontsource/poppins/files/poppins-latin-800-normal.woff2',
  '@fontsource/inter/files/inter-latin-400-normal.woff2',
  '@fontsource/inter/files/inter-latin-600-normal.woff2',
];

rmSync(destino, { recursive: true, force: true });
cpSync(join(raiz, 'pagina'), destino, { recursive: true });
mkdirSync(join(destino, 'fontes'), { recursive: true });
for (const fonte of fontes) {
  cpSync(join(raiz, 'node_modules', fonte), join(destino, 'fontes', fonte.split('/').pop()!));
}
cpSync(dist, join(destino, 'app'), { recursive: true });

console.log('Site montado em site/ (apresentação na raiz, simulador em site/app/).');
