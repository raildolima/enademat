# Regras para Figuras e Recortes

**Glos de Aplicação:** `scripts/pdf/**`, `content/**/figuras.manifest.json`, `public/figuras/**`

## Diretrizes de Recorte vs Transcrição
- **Transcrever:** parágrafos, listas, afirmativas, fórmulas, matrizes, tabelas simples e quadros.
- **Recortar (WebP):** fotos, charges, mapas, gráficos, diagramas geométricos, infográficos, telas de software, alternativas visuais e símbolos históricos.
- **Alternativas que são imagem:** um recorte por alternativa (`qNNN-alt-a.webp`), mapeado rigorosamente pela **letra impressa** (nunca pela posição geométrica no caderno).
- **Elementos proibidos no recorte:** cabeçalhos de página, rodapés com paginação, logotipos de governo/banca, código de barras, textos "Área livre", réguas divisórias e marcas de corte de gráfica.

## Manifesto de Recortes (`figuras.manifest.json`)
- Cada prova possui um arquivo `content/provas/<provaId>/figuras.manifest.json`.
- Cada entrada possui: `arquivo`, `pagina`, `bbox` `[x0, y0, x1, y1]` em pontos do PyMuPDF, `dpi` (220 padrão), `uso` (`questaoId`, `papel`, `letra?`) e `status` (`pendente` | `aprovado` | `revisao-humana`).
- Recorte automatizado pelo script `scripts/pdf/recortar.py <provaId> [--paginas ...]`.
- Nenhuma figura com status `pendente` é admitida no release.
