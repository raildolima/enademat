import * as fs from 'node:fs';
import * as path from 'node:path';

const RAIZ = process.cwd();

export function gerarConferenciaHtml(provaId: string, opts: { dryRun?: boolean } = {}): string {
  const provaDir = path.resolve(RAIZ, 'content/provas', provaId);
  let questoes: any[] = [];

  const questoesDir = path.join(provaDir, 'questoes');
  if (fs.existsSync(questoesDir)) {
    for (const f of fs.readdirSync(questoesDir)) {
      if (f.endsWith('.json')) {
        try {
          const q = JSON.parse(fs.readFileSync(path.join(questoesDir, f), 'utf-8'));
          questoes.push(q);
        } catch {
          // ignora em caso de arquivo temporário
        }
      }
    }
  }

  const linhasQuestoes = questoes.map((q) => {
    const pags = (q.paginas || []).map((p: number) => `p${String(p).padStart(3, '0')}.png`).join(', ');
    return `
      <section class="questao-card" id="${q.id}">
        <h2>${q.rotulo} (${q.id}) — Páginas: ${pags}</h2>
        <div class="comparacao">
          <div class="renderizado">
            <h3>Transcrição JSON</h3>
            <pre><code>${JSON.stringify(q, null, 2)}</code></pre>
          </div>
          <div class="original">
            <h3>Página Original</h3>
            ${(q.paginas || [])
              .map((p: number) => `<img src="../../work/paginas/${provaId}/p${String(p).padStart(3, '0')}.png" alt="Página ${p}" style="max-width: 100%; border: 1px solid #ccc; margin-bottom: 12px;" />`)
              .join('\n')}
          </div>
        </div>
      </section>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Conferência Visual · ${provaId}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 24px; background: #f8f9fa; color: #1a1a1a; }
    h1 { color: #0d47a1; border-bottom: 2px solid #0d47a1; padding-bottom: 8px; }
    .questao-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    pre { background: #f1f3f5; padding: 12px; border-radius: 6px; overflow: auto; max-height: 500px; font-size: 13px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>Conferência Visual — ${provaId}</h1>
  <p>Total de questões transcritas: ${questoes.length}</p>
  <main>
    ${linhasQuestoes || '<p>Nenhuma questão transcrita nesta prova ainda.</p>'}
  </main>
</body>
</html>`;

  if (!opts.dryRun) {
    const outDir = path.resolve(RAIZ, 'work/conferencia');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, `${provaId}.html`);
    fs.writeFileSync(outFile, html, 'utf-8');
    console.log(`[CONFERÊNCIA] Folha HTML gerada com sucesso em: ${outFile}`);
  }

  return html;
}

// Execução CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const prova = args[0] || '2025-prova1';
  gerarConferenciaHtml(prova);
}
