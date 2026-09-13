import * as fs from 'node:fs';
import * as path from 'node:path';

const outDir = path.resolve(process.cwd(), 'src/data/generated');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const indiceVazio = {
  provas: [],
  questoes: [],
};

fs.writeFileSync(
  path.join(outDir, 'indice.json'),
  JSON.stringify(indiceVazio, null, 2),
  'utf-8'
);

console.log('Build de conteúdo (mínimo Fase 0): índice gerado com sucesso em src/data/generated/indice.json');
