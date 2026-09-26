# Simulador ENADE Matemática — Licenciatura

Aplicação web estática, acessível e responsiva para estudo interativo e aprofundamento pedagógico com as provas do Exame Nacional de Desempenho dos Estudantes (ENADE) para o curso de **Matemática (Licenciatura)**.

---

## 🎯 Visão Geral

O **Simulador ENADE Matemática** reúne o acervo integral das edições mais recentes do exame:
- **ENADE 2021 — Licenciatura em Matemática** (40 questões: 8 de Formação Geral e 32 do Componente Específico);
- **ENADE 2025 — Prova 1 (Caderno 1 — Teoria e Prática Docente)** (81 questões: 30 de Formação Geral e 51 do Componente Específico);
- **ENADE 2025 — Prova 5 (Caderno 5 — Prática Docente nos Anos Finais do Ensino Fundamental)** (81 questões: 30 de Formação Geral e 51 do Componente Específico).

Total: **202 questões transcritas com fidelidade literal** e **202 resoluções comentadas completas**, com rigor conceitual, linguagem didática e verificação matemática independente.

---

## ✨ Principais Funcionalidades

- **Banco de Questões Filtrável:** busca instantânea e combinação de filtros por ano (2021, 2025), prova (2021, Prova 1, Prova 5), componente (Formação Geral ou Componente Específico) e tipo (Múltipla Escolha ou Discursiva), com sincronização transparente na URL (`hash`).
- **Resoluções Comentadas Estruturadas:** cada resolução apresenta *Ideia-chave*, *Resolução passo a passo*, *Análise detalhada de cada alternativa* (ou *Padrão de Resposta / Critérios de Correção* nas discursivas), *Conceitos Envolvidos* e *Dica de Prova*.
- **Pop-up Não Intrusivo da Questão:** na tela de resolução, o botão *"Ver questão"* permite visualizar o enunciado completo e as alternativas em um pop-up flutuante (`Floating UI`) via mouse hover com tolerância poligonal (`safePolygon`), foco por teclado (`Tab`/`Esc`) ou toque móvel com botão de fechamento.
- **Treino de Questões Discursivas:** área de rascunho com salvamento local automático em memória, permitindo ao estudante estruturar seu texto antes de confrontar com o padrão oficial de resposta e os critérios de pontuação da banca.
- **Renderização Matemática Impecável (KaTeX):** equações em linha e blocos matemáticos complexos (matrizes, sistemas de congruências, fórmulas de cálculo e probabilidade) renderizados em tempo real com tipografia matemática nítida e de alto desempenho.
- **72 Figuras de Alta Resolução:** gráficos, esquemas geométricos, infográficos e charges recortados diretamente dos cadernos oficiais e otimizados em formato WebP para carregamento ultrarrápido.
- **Acessibilidade Completa (WCAG 2.2 AA):** contraste verificado para temas claro e escuro, navegação total por teclado, foco visível, link para pular direto ao conteúdo principal (`skip-link`) e tags semânticas ARIA auditadas via `@axe-core/playwright`.

---

## 🛠️ Stack Tecnológica

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Estilização:** CSS nativo modular com tokens semânticos (`src/styles/tokens.css`) e suporte a temas claro/escuro (`prefers-color-scheme`)
- **Renderização KaTeX & Markdown:** `react-markdown`, `remark-math`, `rehype-katex`, `katex`, `remark-gfm`
- **Interação Flutuante:** [@floating-ui/react](https://floating-ui.com/)
- **Roteamento:** `react-router-dom` (modo `createHashRouter` para hospedagem estática universal em qualquer servidor ou CDN)
- **Processamento de Dados & PDFs:** Python 3.14 + PyMuPDF (`fitz`), Pillow, NumPy
- **Qualidade & Testes:** [Vitest](https://vitest.dev/) (testes unitários de lógica e TDD) e [Playwright](https://playwright.dev/) (testes E2E de integração, usabilidade móvel, acessibilidade Axe e smoke tests de 100% das questões)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)

### Instalação e Execução

1. **Clone ou abra o repositório:**
   ```bash
   cd "C:\Users\Raildo Lima\Desktop\Enade_simulador - AGY"
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Gere os índices e catálogo de conteúdo:**
   ```bash
   npm run content:build
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:5173`

---

## 🧪 Testes e Validação

O projeto possui rigorosa automação de testes cobrindo dados, lógica e interface gráfica:

- **Validar integridade de todas as questões e resoluções:**
  ```bash
  npm run content:validate -- --release
  ```
- **Executar testes unitários (Vitest):**
  ```bash
  npm test
  ```
- **Executar testes E2E e Acessibilidade (Playwright):**
  ```bash
  npm run test:e2e
  ```
- **Gerar build estático para produção:**
  ```bash
  npm run build
  ```
- **Visualizar o build de produção localmente:**
  ```bash
  npm run preview
  ```

---

## 📂 Estrutura do Repositório

```text
├── content/                     # Dados canônicos do simulador
│   └── provas/
│       ├── 2021-licenciatura/   # Questões, textos-base, resoluções e gabarito.json
│       ├── 2025-prova1/
│       └── 2025-prova5/
├── public/
│   └── figuras/                 # Imagens recortadas em WebP das provas
├── scripts/
│   ├── content/                 # Validadores, comparador cego e builders TypeScript
│   ├── pdf/                     # Scripts de renderização e recorte via PyMuPDF
│   └── verificacao/             # Scripts Python de checagem numérica de questões
├── src/
│   ├── components/              # Componentes de UI (Markdown, TextoRico, CartaoGabarito, etc.)
│   ├── data/                    # Tipos TypeScript, carregador lazy e funções de filtragem
│   ├── pages/                   # Telas: PaginaBanco, PaginaQuestao, PaginaResolucao, Pagina404
│   ├── styles/                  # tokens.css, global.css e estilos modulares
│   └── router.tsx               # Configuração do createHashRouter
├── tests/
│   ├── e2e/                     # Testes Playwright (filtros, acessibilidade, pop-up, smoke)
│   └── unit/                    # Testes Vitest (filtragem, cartões, componentes)
├── docs/                        # Especificação, arquitetura, progresso e revisão humana
└── work/                        # Relatórios de auditoria, verificações e divergências
```

---

## ⚖️ Aviso Legal e Créditos

- **Autoria das Provas e Gabaritos:** Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira ([INEP](https://www.gov.br/inep/pt-br)), Ministério da Educação (MEC), Governo Federal do Brasil.
- **Caráter Educacional e Não Governamental:** Este simulador é um projeto de código aberto estritamente pedagógico e acadêmico, desenvolvido como recurso complementar de estudo e pesquisa didática para estudantes e professores da Licenciatura em Matemática. Não possui qualquer vínculo oficial, institucional ou comercial com o INEP ou o Ministério da Educação.
- **Licença:** Os cadernos originais do ENADE são documentos públicos da administração federal brasileira. O código-fonte da aplicação e as resoluções comentadas autorais são disponibilizados para fins educacionais e sem fins lucrativos.
