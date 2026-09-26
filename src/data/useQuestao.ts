import { useEffect, useState } from 'react';
import type { IndiceProvas, ProvaCompleta, Questao, TextoBase } from './tipos';
import { carregarIndice, carregarQuestao } from './carregar';

interface EstadoQuestao {
  questao: Questao | null;
  textoBase?: TextoBase;
  prova: ProvaCompleta | null;
  indice: IndiceProvas | null;
  carregando: boolean;
  erro: string | null;
}

/**
 * Carrega questão, prova e índice. Uma resposta que chega depois de o usuário já ter trocado de
 * questão é descartada, para não sobrescrever a tela atual (CR-05).
 */
export function useQuestao(questaoId: string | undefined, mensagemErro: string): EstadoQuestao {
  const [estado, setEstado] = useState<EstadoQuestao>({
    questao: null,
    prova: null,
    indice: null,
    carregando: true,
    erro: null,
  });

  useEffect(() => {
    if (!questaoId) return;
    let ativo = true;
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }));

    Promise.all([carregarQuestao(questaoId), carregarIndice()])
      .then(([dados, indice]) => {
        if (!ativo) return;
        setEstado({
          questao: dados.questao,
          textoBase: dados.textoBase,
          prova: dados.prova,
          indice,
          carregando: false,
          erro: null,
        });
      })
      .catch((err) => {
        if (!ativo) return;
        console.error(`Erro ao carregar ${questaoId}:`, err);
        setEstado((anterior) => ({ ...anterior, carregando: false, erro: mensagemErro }));
      });

    return () => {
      ativo = false;
    };
  }, [questaoId, mensagemErro]);

  return estado;
}
