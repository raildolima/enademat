import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Sanidade da Fase 0 (Fundação): o ambiente jsdom está ativo e o index.html atende à especificação.
describe('Sanidade da Fase 0 (Fundação)', () => {
  it('ambiente jsdom disponível para os testes de componentes', () => {
    const div = document.createElement('div');
    div.innerHTML = '<span lang="pt-BR">ok</span>';
    expect(div.querySelector('span')?.getAttribute('lang')).toBe('pt-BR');
  });

  it('index.html declara pt-BR, viewport e título', () => {
    const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.documentElement.getAttribute('lang')).toBe('pt-BR');
    expect(doc.querySelector('meta[name="viewport"]')?.getAttribute('content')).toContain('width=device-width');
    expect(doc.title.trim().length).toBeGreaterThan(0);
  });
});
