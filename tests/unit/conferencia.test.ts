import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { gerarConferenciaHtml } from '../../scripts/content/conferencia';

// CR-23: a folha de conferência mostra o JSON da transcrição; "<" do conteúdo não pode virar tag.
describe('CR-23 — conferência escapa o conteúdo', () => {
  it('trechos com "<" aparecem escapados no HTML', () => {
    const provas = ['2021-licenciatura', '2025-prova1', '2025-prova5'];
    let alvo: { provaId: string; trecho: string } | null = null;
    for (const provaId of provas) {
      const dir = path.resolve(process.cwd(), 'content/provas', provaId, 'questoes');
      for (const f of fs.readdirSync(dir)) {
        const bruto = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')), null, 2);
        const linha = bruto.split('\n').find((l) => l.includes('<'));
        if (linha) {
          alvo = { provaId, trecho: linha.trim() };
          break;
        }
      }
      if (alvo) break;
    }
    expect(alvo, 'nenhuma questão com "<" encontrada').not.toBeNull();

    const html = gerarConferenciaHtml(alvo!.provaId, { dryRun: true });
    const escapado = alvo!.trecho.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    expect(html).toContain(escapado);
    expect(html).not.toContain(alvo!.trecho);
  });
});
