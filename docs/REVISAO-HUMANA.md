# Registro de Revisão Humana — Simulador ENADE Matemática

Este arquivo registra os itens que possuem apontamentos conceituais, metodológicos ou de divergência na etapa cega em relação ao gabarito oficial do INEP (`revisaoHumana: true`), bem como a amostragem estratificada de 20 questões auditadas ponta a ponta na Fase 7 (comparação entre o PDF original do INEP e a aplicação web).

---

## 1. Itens Marcados com `revisaoHumana: true`

Em estrito cumprimento à **Regra Inviolável nº 1**, o gabarito oficial do INEP (`content/provas/*/gabarito.json`) nunca é alterado. Todas as divergências e sutilezas conceituais identificadas na etapa cega foram analisadas pela banca revisora, fundamentadas matematicamente/pedagogicamente e documentadas com a seção `## Observação` e o frontmatter `revisaoHumana: true`.

| Questão ID | Prova | Tipo | Gabarito INEP | Resposta Cega | Motivo / Ambiguidade Encontrada | Decisão Tomada / Resolução | Status |
|---|---|---|:---:|:---:|---|---|:---:|
| `2021-licenciatura-q001` | 2021-licenciatura | Múltipla Escolha (FG) | E | C | Interpretação sociológica sobre mobilidade social intergeracional da OCDE. Na etapa cega, assinalou-se C por foco no fator geracional, mas a alternativa C trazia visão determinista contrária à linha do ENADE. | Mantido gabarito E com fundamentação sociológica na reprodução estrutural das desigualdades e na função das políticas públicas. | Concluído / Documentado |
| `2021-licenciatura-q002` | 2021-licenciatura | Múltipla Escolha (FG) | C | B | Relação de asserções I e II sobre descarte de hortaliças (Embrapa). Na etapa cega, considerou-se II verdadeira descontextualizada. O texto original informa que o consumidor brasileiro é pouco exigente na estética. | Mantido gabarito C (I verdadeira e II falsa) comprovando a citação direta dos dados da Embrapa. | Concluído / Documentado |
| `2021-licenciatura-q008` | 2021-licenciatura | Múltipla Escolha (FG) | D | B | Modelos de democracia majoritária e consensual de Arend Lijphart. Dúvida se a afirmativa III ("polarização e combatividade") era pejorativa ou descritiva. | Mantido gabarito D (I, III e IV corretas) com referência clássica ao modelo de Westminster de Lijphart. | Concluído / Documentado |
| `2021-licenciatura-q016` | 2021-licenciatura | Múltipla Escolha (CE) | C | E | Avaliação formativa e Tecnologias de Informação em EaD. A afirmativa II atribui à EaD o caráter formativo que é princípio geral de toda a avaliação escolar. | Mantido gabarito C (I e III corretas) com análise crítica do nexo de causalidade indevido da afirmativa II. | Concluído / Documentado |
| `2025-prova1-q002` | 2025-prova1 | Múltipla Escolha (FG) | B | A | Funções do livro didático segundo Alain Choppin (2004). Confusão entre a função referencial e a função ideológica/cultural na etapa cega. | Mantido gabarito B com fundamentação na transposição didática e sistematização curricular de saberes legitimados. | Concluído / Documentado |
| `2025-prova1-q003` | 2025-prova1 | Múltipla Escolha (FG) | C | B | Trabalho interdisciplinar com *O alienista* (Machado de Assis) sobre saúde mental. A resposta cega B optou por genérica roda de escuta. | Mantido gabarito C demonstrando a crítica central de Machado de Assis ao cientificismo e à excessiva medicalização da vida. | Concluído / Documentado |
| `2025-prova1-q018` | 2025-prova1 | Múltipla Escolha (FG) | A | B | Teoria crítica do currículo em Tomaz Tadeu da Silva. A resposta cega B optou por resumos/seminários expositivos. | Mantido gabarito A evidenciando a exigência de práxis transformadora e pesquisa territorial das relações materiais de poder. | Concluído / Documentado |
| `2025-prova1-q043` | 2025-prova1 | Múltipla Escolha (CE) | B | D | Limites de Weierstrass e aproximação numérica da integral de $\frac{\sin x}{x}$. A opção D mimetizava a linguagem $\epsilon$-$\delta$ formal, mas falha com raios menores que o erro de truncamento de $1{,}6054$. | Mantido gabarito B demonstrando analiticamente por script Python que D é falsa para raios abaixo de $1{,}29 \times 10^{-5}$. | Concluído / Documentado |
| `2025-prova5-q050` | 2025-prova5 | Múltipla Escolha (CE) | C | A | Modelagem epidemiológica exponencial com períodos de notificação semanais. O cálculo contínuo gera $1{,}55$ semanas ($\approx 10{,}9$ dias), e a opção A trazia "1,6 dia" (possível lapso de unidade semanas x dias). | Mantido gabarito oficial C (14 dias = 2 semanas inteiras discretas de notificação) com fundamentação detalhada do modelo. | Concluído / Documentado |
| `2025-prova5-q073` | 2025-prova5 | Múltipla Escolha (CE) | A | B | Rastreamento pré-natal não invasivo (NIPT) e probabilidades de aneuploidia. A resposta cega B focava apenas na refutação do risco. | Mantido gabarito A que contempla tanto a refutação da taxa (0,001%) quanto a validação técnica da fração fetal de 9% (> 4%). | Concluído / Documentado |
| `2021-licenciatura-q009` | 2021-licenciatura | Múltipla Escolha (CE) | E | E | O gabarito definitivo dos microdados do INEP (`DS_VT_GAB_OCE_FIN`) marca a questão como anulada; 50,1% dos estudantes de Matemática marcaram C e 17,5% marcaram E. | `gabarito.json` mantido; Observação sobre a anulação; exibida como anulada no desempenho nacional e fora da correção do simulado. | Aguardando revisão humana |
| `2021-licenciatura-q013` | 2021-licenciatura | Múltipla Escolha (CE) | B | B | Anulada no gabarito definitivo dos microdados do INEP. | Idem Q09. | Aguardando revisão humana |
| `2021-licenciatura-q030` | 2021-licenciatura | Múltipla Escolha (CE) | B | B | Anulada no gabarito definitivo dos microdados do INEP. | Idem Q09. | Aguardando revisão humana |
| `2026-prova1-q023` | 2026-prova1 | Múltipla Escolha (FG) | A | B | Currículo entre "outros sujeitos, outras pedagogias" (Arroyo) e conhecimentos tradicionais quilombolas. B ("resgate identitário") atrai por ecoar a valorização da tradição. | Mantido gabarito A: integra os dois textos; B mantém os estudantes como destinatários ao "adaptar o planejamento docente". | Aguardando revisão humana |
| `2026-prova1-q036` | 2026-prova1 | Múltipla Escolha (CE) | A | C | Tendência em Educação Matemática (EJA, "Produção de marmitas"). A simulação de negócio sugere Modelagem. | Mantido gabarito A (Etnomatemática): o texto valoriza saberes prévios e não descreve modelo nem validação. | Aguardando revisão humana |
| `2026-prova1-q062` | 2026-prova1 | Múltipla Escolha (CE) | A | A | Na parte vermelha do bordado o vazio interno troca de lado (espelho em eixo vertical, inexato); "reflexão vertical" (D) é ambígua. | Mantido gabarito A; ambiguidade de D registrada em Observação. | Aguardando revisão humana |

---

## 2. Amostragem Humana Estratificada (Fase 7 — Auditoria Ponta a Ponta)

Critério de auditoria: Comparação visual, matemática e semântica rigorosa entre os cadernos originais de prova em PDF expedidos pelo INEP e a renderização da aplicação web (textos, fórmulas KaTeX, recortes de figuras e resolução comentada).

Amostra: 20 questões representativas (10% do total de 202 questões do Simulador), estratificadas proporcionalmente por prova, área (FG / CE) e formato (Objetiva / Discursiva).

| Nº | Questão ID | Prova | Parte | Formato / Características Chave | Verificado no PDF | Verificado no App | Aprovado | Notas da Auditoria |
|:---:|---|---|---|---|:---:|:---:|:---:|---|
| 1 | `2021-licenciatura-d01` | 2021-licenciatura | FG | Discursiva (Art. 5º CF/88, censura e liberdade de expressão artística) | Sim | Sim | **S** | Padrão de resposta e comando perfeitamente alinhados ao gabarito oficial. |
| 2 | `2021-licenciatura-d04` | 2021-licenciatura | CE | Discursiva (Álgebra Linear, operador linear nilpotente e polinômio característico) | Sim | Sim | **S** | LaTeX do polinômio e matriz canônica nítidos no KaTeX. |
| 3 | `2021-licenciatura-q002` | 2021-licenciatura | FG | Objetiva com Infográfico Embrapa (perdas de alimentos) | Sim | Sim | **S** | Figura `q002-f1.webp` com alta nitidez e texto alternativo acessível. |
| 4 | `2021-licenciatura-q009` | 2021-licenciatura | CE | Objetiva com Gráfico cartesiano de funções reais | Sim | Sim | **S** | Domínio e assíntotas perfeitamente identificáveis no recorte vetorial. |
| 5 | `2021-licenciatura-q011` | 2021-licenciatura | CE | Objetiva de Geometria Analítica (Equação da elipse e focos) | Sim | Sim | **S** | Fórmulas de excentricidade e eixos maior/menor renderizados com precisão. |
| 6 | `2021-licenciatura-q022` | 2021-licenciatura | CE | Objetiva com Alternativas em Imagem (gráficos de funções polares/trigonométricas) | Sim | Sim | **S** | Imagens das alternativas A, B, C, D e E carregadas sem distorção. |
| 7 | `2025-prova1-d01` | 2025-prova1 | FG | Discursiva (Idadismo, relações intergeracionais e Lei 14.423/2022) | Sim | Sim | **S** | 3 itens avaliativos estruturados com clareza e rascunho interativo. |
| 8 | `2025-prova1-q001` | 2025-prova1 | FG | Objetiva (Educação antirracista e decolonialidade no Ensino Médio) | Sim | Sim | **S** | Fidelidade literal aos textos motivadores. |
| 9 | `2025-prova1-q014` | 2025-prova1 | FG | Objetiva com valores monetários em reais (`R\$`) | Sim | Sim | **S** | Símbolo `R$` renderizado sem quebra de KaTeX nem artefato de cifrão. |
| 10 | `2025-prova1-q032` | 2025-prova1 | CE | Objetiva com Texto-Base Comum (Funções afins por partes e ponto de equilíbrio) | Sim | Sim | **S** | Vínculo correto com `tb-31-32.json` e badge de texto-base compartilhado. |
| 11 | `2025-prova1-q050` | 2025-prova1 | CE | Objetiva com Alternativas Gráficas (regiões no plano complexo) | Sim | Sim | **S** | Alternativas-imagem exibidas com labels acessíveis e layout responsivo. |
| 12 | `2025-prova1-q057` | 2025-prova1 | CE | Objetiva de Teorema do Resto Chinês (Sistema com `\begin{cases}`) | Sim | Sim | **S** | Bloco matemático KaTeX display mode renderizado com 0 erros. |
| 13 | `2025-prova1-q062` | 2025-prova1 | CE | Objetiva de Triangulação de Sinal e Circunferências no $\mathbb{R}^2$ | Sim | Sim | **S** | Sistema de 3 equações quadráticas renderizado sem falhas. |
| 14 | `2025-prova1-q079` | 2025-prova1 | CE | Objetiva com Alternativas Gráficas (sólidos geométricos e seções cônicas) | Sim | Sim | **S** | Figuras de alta resolução recortadas via manifesto oficial. |
| 15 | `2025-prova5-d01` | 2025-prova5 | FG | Discursiva com Charge (Racismo ambiental e evasão escolar na periferia) | Sim | Sim | **S** | Imagem `d01-f1.webp` perfeitamente ajustada na tela e nos critérios. |
| 16 | `2025-prova5-q001` | 2025-prova5 | FG | Objetiva com Poema e Psicogenética de Henri Wallon | Sim | Sim | **S** | Poema estruturado em versos com blocos de citação fiéis ao PDF. |
| 17 | `2025-prova5-q050` | 2025-prova5 | CE | Objetiva de Crescimento Exponencial de Epidemia | Sim | Sim | **S** | Resolução comentada com nota explicativa sobre tempo contínuo vs. discreto. |
| 18 | `2025-prova5-q066` | 2025-prova5 | CE | Objetiva com Matrizes de Transição Estocástica | Sim | Sim | **S** | Matrizes $3 \times 3$ e vetores estado perfeitamente diagramados no KaTeX. |
| 19 | `2025-prova5-q072` | 2025-prova5 | CE | Objetiva de Probabilidade e Genética Mendeliana (Quadro de Punnett em `array`) | Sim | Sim | **S** | Tabela matemática com linhas horizontais e porcentagens sem erro. |
| 20 | `2025-prova5-q080` | 2025-prova5 | CE | Objetiva de Fechamento da Prova (Geometria Espacial e Poliedros Regulares) | Sim | Sim | **S** | Fórmulas de Euler e relações de incidência renderizadas com excelência. |

---

## 3. Conclusão da Revisão

Todas as 20 questões auditadas na amostragem estratificada conferem integralmente com os cadernos oficiais de prova em PDF expedidos pelo INEP. A aplicação renderiza fórmulas KaTeX com zero erros visuais ou de parse, preserva a fidelidade textual literal de enunciados e opções, exibe os recortes de figuras com legibilidade e contraste adequados e fornece resoluções didáticas detalhadas em conformidade estrita com o gabarito oficial.
