import type { IndiceProvas, ProvaCompleta, ProvaId, Questao, TextoBase } from './tipos';

let cacheIndice: IndiceProvas | null = null;
const cacheProvas = new Map<ProvaId, ProvaCompleta>();

/**
 * Carrega o índice geral de provas e resumos de questões.
 */
export async function carregarIndice(): Promise<IndiceProvas> {
  if (cacheIndice) {
    return cacheIndice;
  }

  try {
    const modulo = await import('./generated/indice.json');
    cacheIndice = (modulo.default || modulo) as IndiceProvas;
    return cacheIndice;
  } catch (erro) {
    console.error('[carregarIndice] Erro ao carregar indice.json:', erro);
    throw new Error('Não foi possível carregar o índice de provas.');
  }
}

/**
 * Carrega os dados completos de uma prova específica sob demanda.
 */
export async function carregarProva(provaId: ProvaId): Promise<ProvaCompleta> {
  if (cacheProvas.has(provaId)) {
    return cacheProvas.get(provaId)!;
  }

  try {
    let dados: ProvaCompleta;
    switch (provaId) {
      case '2021-licenciatura': {
        const modulo = await import('./generated/2021-licenciatura.json');
        dados = (modulo.default || modulo) as ProvaCompleta;
        break;
      }
      case '2025-prova1': {
        const modulo = await import('./generated/2025-prova1.json');
        dados = (modulo.default || modulo) as ProvaCompleta;
        break;
      }
      case '2025-prova5': {
        const modulo = await import('./generated/2025-prova5.json');
        dados = (modulo.default || modulo) as ProvaCompleta;
        break;
      }
      default:
        throw new Error(`Prova não reconhecida: ${provaId}`);
    }

    cacheProvas.set(provaId, dados);
    return dados;
  } catch (erro) {
    console.error(`[carregarProva] Erro ao carregar dados da prova ${provaId}:`, erro);
    throw new Error(`Não foi possível carregar os dados da prova ${provaId}.`);
  }
}

/**
 * Carrega uma questão específica e seu texto-base associado (se houver).
 */
export async function carregarQuestao(questaoId: string): Promise<{
  questao: Questao;
  textoBase?: TextoBase;
  prova: ProvaCompleta;
}> {
  // Extrai provaId do questaoId (ex: "2025-prova1-q032" -> "2025-prova1")
  let provaId: ProvaId;
  if (questaoId.startsWith('2021-licenciatura')) {
    provaId = '2021-licenciatura';
  } else if (questaoId.startsWith('2025-prova1')) {
    provaId = '2025-prova1';
  } else if (questaoId.startsWith('2025-prova5')) {
    provaId = '2025-prova5';
  } else {
    throw new Error(`ID de questão inválido: ${questaoId}`);
  }

  const provaCompleta = await carregarProva(provaId);
  const questao = provaCompleta.questoes.find((q) => q.id === questaoId);

  if (!questao) {
    throw new Error(`Questão ${questaoId} não encontrada na prova ${provaId}.`);
  }

  let textoBase: TextoBase | undefined;
  if (questao.textoBaseId && provaCompleta.textosBase[questao.textoBaseId]) {
    textoBase = provaCompleta.textosBase[questao.textoBaseId];
  }

  return {
    questao,
    textoBase,
    prova: provaCompleta,
  };
}
