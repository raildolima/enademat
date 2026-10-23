import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, CircleCheck, Flag, Pause, Play, Timer } from 'lucide-react';
import type { Letra, ProvaCompleta, ProvaId } from '../../data/tipos';
import { carregarProva } from '../../data/carregar';
import {
  codificarRespostas,
  corrigirSimulado,
  decodificarRespostas,
  formatarDuracao,
  questoesDoSimulado,
  type ModoSimulado,
} from '../../data/simulado';
import { ConteudoQuestao } from '../../components/ConteudoQuestao';
import { CartaoGabarito } from '../resolucao/CartaoGabarito';
import styles from './PaginaSimulado.module.css';

const NOME_PARTE = {
  'formacao-geral': 'Formação Geral',
  'componente-especifico': 'Componente Específico',
} as const;

/** Cronômetro só em memória (RF15): pausa, retoma e não é anunciado a cada segundo. */
const Cronometro: React.FC = () => {
  const [segundos, setSegundos] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const id = window.setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [pausado]);

  return (
    <div className={styles.cronometro}>
      <Timer size={18} aria-hidden="true" />
      <span role="timer" aria-live="off" aria-label="Tempo decorrido">
        {formatarDuracao(segundos)}
      </span>
      <button type="button" className={styles.btnIcone} onClick={() => setPausado((p) => !p)}>
        {pausado ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
        {pausado ? 'Retomar' : 'Pausar'}
      </button>
    </div>
  );
};

export const PaginaSimulado: React.FC = () => {
  const { provaId } = useParams<{ provaId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prova, setProva] = useState<ProvaCompleta | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  // Treino: questões cujo gabarito já foi conferido (memória; recomeça ao recarregar)
  const [conferidas, setConferidas] = useState<Set<number>>(() => new Set());
  const [confirmandoFim, setConfirmandoFim] = useState(false);

  useEffect(() => {
    let ativo = true;
    setProva(null);
    setErro(null);
    carregarProva(provaId as ProvaId)
      .then((dados) => ativo && setProva(dados))
      .catch(() => ativo && setErro('Prova não encontrada.'));
    return () => {
      ativo = false;
    };
  }, [provaId]);

  const questoes = useMemo(() => (prova ? questoesDoSimulado(prova.questoes) : []), [prova]);
  const respostas = useMemo(() => decodificarRespostas(searchParams.get('r'), questoes), [searchParams, questoes]);

  const modoParam = searchParams.get('modo');
  const modo: ModoSimulado | null = modoParam === 'treino' || modoParam === 'prova' ? modoParam : null;
  const finalizado = searchParams.get('fim') === '1';
  const comCronometro = modo === 'prova' && searchParams.get('crono') === '1';
  const indice = Math.min(Math.max(Number(searchParams.get('q')) || 1, 1), Math.max(questoes.length, 1)) - 1;

  const atualizar = (mudancas: Record<string, string | null>, substituir = false) => {
    setSearchParams(
      (atual) => {
        const novo = new URLSearchParams(atual);
        for (const [chave, valor] of Object.entries(mudancas)) {
          if (valor === null) novo.delete(chave);
          else novo.set(chave, valor);
        }
        return novo;
      },
      { replace: substituir }
    );
  };

  if (erro) {
    return (
      <div className={styles.pagina}>
        <p role="alert">{erro}</p>
        <Link to="/">Voltar ao banco</Link>
      </div>
    );
  }
  if (!prova) {
    return (
      <div className={styles.pagina}>
        <p role="status">Carregando simulado...</p>
      </div>
    );
  }

  const gabarito = prova.gabarito;
  const titulo = `Simulado — ${prova.prova.titulo}`;

  // Tela inicial: escolha do modo
  if (!modo) {
    return <TelaInicio titulo={titulo} provaId={prova.prova.id} total={questoes.length} onIniciar={atualizar} />;
  }

  // Tela de resultado
  if (finalizado && gabarito) {
    const anuladas = new Set(
      Object.entries(prova.estatisticas?.itens ?? {})
        .filter(([, item]) => item.anulada)
        .map(([numero]) => Number(numero))
    );
    const resultado = corrigirSimulado(questoes, respostas, gabarito, anuladas);
    const percentual = resultado.total ? Math.round((resultado.acertos / resultado.total) * 100) : 0;
    return (
      <article className={styles.pagina}>
        <h1 className={styles.titulo}>Resultado do simulado</h1>
        <p className={styles.subtitulo}>{prova.prova.titulo}</p>
        <p className={styles.placar}>
          <strong>{resultado.acertos}</strong> de {resultado.total} questões objetivas corretas ({percentual}%)
        </p>
        {anuladas.size > 0 && (
          <p className={styles.subtitulo}>
            {anuladas.size === 1 ? 'Uma questão anulada' : `${anuladas.size} questões anuladas`} no gabarito final do
            INEP ({[...anuladas].sort((a, b) => a - b).join(', ')}) não {anuladas.size === 1 ? 'entra' : 'entram'} na
            correção.
          </p>
        )}
        <table className={styles.tabela}>
          <caption>Desempenho por parte da prova</caption>
          <thead>
            <tr>
              <th scope="col">Parte</th>
              <th scope="col">Acertos</th>
              <th scope="col">Erros</th>
              <th scope="col">Em branco</th>
            </tr>
          </thead>
          <tbody>
            {resultado.porParte.map((p) => (
              <tr key={p.parte}>
                <th scope="row">{NOME_PARTE[p.parte]}</th>
                <td>
                  {p.acertos} de {p.total}
                </td>
                <td>{p.erros}</td>
                <td>{p.emBranco}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {resultado.revisar.length > 0 && (
          <section aria-labelledby="titulo-revisar">
            <h2 id="titulo-revisar" className={styles.tituloSecao}>
              Questões para revisar
            </h2>
            <ul className={styles.listaRevisar}>
              {resultado.revisar.map(({ questao, marcada, correta }) => (
                <li key={questao.id}>
                  <Link
                    to={`/questao/${questao.id}/resolucao${marcada ? `?marcada=${marcada}` : ''}`}
                    className={styles.linkRevisar}
                  >
                    {questao.rotulo}
                  </Link>{' '}
                  — {marcada ? `você marcou ${marcada}` : 'em branco'}; gabarito {correta}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.acoes}>
          <Link to={`/simulado/${prova.prova.id}`} className={styles.btnPrimario}>
            Refazer o simulado
          </Link>
          <Link to={`/prova/${prova.prova.id}`} className={styles.btnSecundario}>
            Voltar à prova
          </Link>
        </div>
      </article>
    );
  }

  const questao = questoes[indice];
  const marcada = respostas[indice];
  const respondidas = respostas.filter(Boolean).length;
  const emBranco = questoes.length - respondidas;
  const conferida = modo === 'treino' && conferidas.has(indice);

  const marcar = (letra: Letra | null) => {
    const novas = [...respostas];
    novas[indice] = letra;
    atualizar({ r: codificarRespostas(novas) }, true);
  };
  const irPara = (i: number) => {
    setConfirmandoFim(false);
    atualizar({ q: String(i + 1) });
  };

  return (
    <article className={styles.pagina}>
      <header className={styles.barraTopo}>
        <div>
          <h1 className={styles.tituloCompacto}>{titulo}</h1>
          <p className={styles.subtitulo}>
            Modo {modo === 'treino' ? 'Treino' : 'Prova'} · {questao.rotulo} ({indice + 1} de {questoes.length}) ·{' '}
            {respondidas} respondidas
          </p>
        </div>
        {comCronometro && <Cronometro />}
      </header>

      <nav aria-label="Questões do simulado" className={styles.navGrade}>
        <ol className={styles.grade}>
          {questoes.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                className={`${styles.celula} ${respostas[i] ? styles.celulaRespondida : ''}`}
                aria-current={i === indice ? 'step' : undefined}
                aria-label={`${q.rotulo}${respostas[i] ? `, marcada ${respostas[i]}` : ', em branco'}`}
                onClick={() => irPara(i)}
              >
                {String(q.numero).padStart(2, '0')}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <ConteudoQuestao
        key={questao.id}
        questao={questao}
        textoBase={questao.textoBaseId ? prova.textosBase[questao.textoBaseId] : undefined}
        alternativaMarcada={marcada}
        onSelecionarAlternativa={marcar}
      />

      {modo === 'treino' && gabarito && (
        <div className={styles.conferencia}>
          {conferida ? (
            <>
              <CartaoGabarito
                questao={questao}
                gabaritoOficial={gabarito.objetivas[String(questao.numero)] ?? null}
                alternativaMarcada={marcada}
              />
              <Link
                to={`/questao/${questao.id}/resolucao${marcada ? `?marcada=${marcada}` : ''}`}
                className={styles.btnSecundario}
              >
                Ver resolução comentada
              </Link>
            </>
          ) : (
            <button
              type="button"
              className={styles.btnPrimario}
              disabled={!marcada}
              onClick={() => setConferidas((c) => new Set(c).add(indice))}
            >
              <CircleCheck size={18} aria-hidden="true" />
              Conferir resposta
            </button>
          )}
        </div>
      )}

      <nav aria-label="Navegação do simulado" className={styles.navInferior}>
        <button
          type="button"
          className={styles.btnSecundario}
          disabled={indice === 0}
          onClick={() => irPara(indice - 1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Anterior
        </button>
        <button
          type="button"
          className={styles.btnSecundario}
          disabled={indice === questoes.length - 1}
          onClick={() => irPara(indice + 1)}
        >
          Próxima
          <ChevronRight size={18} aria-hidden="true" />
        </button>
        {confirmandoFim ? (
          <div className={styles.confirmacao} role="group" aria-label="Confirmar finalização">
            <p role="status">
              {emBranco > 0
                ? `Você deixou ${emBranco} ${emBranco === 1 ? 'questão' : 'questões'} em branco. Finalizar mesmo assim?`
                : 'Todas as questões foram respondidas. Finalizar?'}
            </p>
            <button type="button" className={styles.btnPrimario} onClick={() => atualizar({ fim: '1', q: null })}>
              Sim, ver resultado
            </button>
            <button type="button" className={styles.btnSecundario} onClick={() => setConfirmandoFim(false)}>
              Continuar respondendo
            </button>
          </div>
        ) : (
          <button type="button" className={styles.btnPrimario} onClick={() => setConfirmandoFim(true)}>
            <Flag size={18} aria-hidden="true" />
            Finalizar simulado
          </button>
        )}
      </nav>
    </article>
  );
};

interface TelaInicioProps {
  titulo: string;
  provaId: string;
  total: number;
  onIniciar: (mudancas: Record<string, string | null>) => void;
}

const TelaInicio: React.FC<TelaInicioProps> = ({ titulo, provaId, total, onIniciar }) => {
  const [modo, setModo] = useState<ModoSimulado>('treino');
  const [cronometro, setCronometro] = useState(true);

  return (
    <article className={styles.pagina}>
      <Link to={`/prova/${provaId}`} className={styles.linkVoltar}>
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar à prova
      </Link>
      <h1 className={styles.titulo}>{titulo}</h1>
      <p className={styles.subtitulo}>
        {total} questões objetivas. A discursiva fica fora da correção automática e pode ser treinada na página da
        questão. Suas respostas ficam só nesta aba e no endereço da página: nada é gravado no navegador.
      </p>
      <form
        className={styles.formInicio}
        onSubmit={(e) => {
          e.preventDefault();
          onIniciar({ modo, crono: modo === 'prova' && cronometro ? '1' : null, q: '1', r: null, fim: null });
        }}
      >
        <fieldset className={styles.fieldset}>
          <legend>Modo</legend>
          <label className={styles.opcao}>
            <input type="radio" name="modo" value="treino" checked={modo === 'treino'} onChange={() => setModo('treino')} />
            <span>
              <strong>Treino</strong> — confira o gabarito a cada questão.
            </span>
          </label>
          <label className={styles.opcao}>
            <input type="radio" name="modo" value="prova" checked={modo === 'prova'} onChange={() => setModo('prova')} />
            <span>
              <strong>Prova</strong> — resultado só no final, como no dia do exame.
            </span>
          </label>
        </fieldset>
        {modo === 'prova' && (
          <label className={styles.opcao}>
            <input type="checkbox" checked={cronometro} onChange={(e) => setCronometro(e.target.checked)} />
            <span>Mostrar cronômetro</span>
          </label>
        )}
        <button type="submit" className={styles.btnPrimario}>
          Começar
        </button>
      </form>
    </article>
  );
};
