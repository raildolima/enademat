import React from 'react';
import { createHashRouter } from 'react-router';
import { Layout } from './Layout';
import { PaginaBanco } from '../features/banco/PaginaBanco';
import { Pagina404 } from './Pagina404';

// Questão e resolução em chunks próprios: o banco (primeira tela) não baixa react-markdown,
// remark/rehype e floating-ui, usados só nelas (CR-31).

// Exibido na primeira carga enquanto o chunk de uma rota lazy é baixado (ex.: link direto para uma questão).
const CarregandoPagina: React.FC = () => (
  <p role="status" style={{ padding: 'var(--espaco-12) var(--espaco-4)', textAlign: 'center' }}>
    Carregando...
  </p>
);

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    HydrateFallback: CarregandoPagina,
    children: [
      {
        index: true,
        element: <PaginaBanco />,
      },
      {
        path: 'questao/:questaoId',
        lazy: async () => ({
          Component: (await import('../features/questao/PaginaQuestao')).PaginaQuestao,
        }),
      },
      {
        path: 'questao/:questaoId/resolucao',
        lazy: async () => ({
          Component: (await import('../features/resolucao/PaginaResolucao')).PaginaResolucao,
        }),
      },
      {
        path: 'prova/:provaId',
        lazy: async () => ({
          Component: (await import('../features/prova/PaginaProva')).PaginaProva,
        }),
      },
      {
        path: 'simulado/:provaId',
        lazy: async () => ({
          Component: (await import('../features/simulado/PaginaSimulado')).PaginaSimulado,
        }),
      },
      {
        path: '*',
        element: <Pagina404 />,
      },
    ],
  },
]);
