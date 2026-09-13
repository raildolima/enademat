import { createHashRouter } from 'react-router';
import { Layout } from './Layout';
import { PaginaBanco } from '../features/banco/PaginaBanco';
import { PaginaQuestao } from '../features/questao/PaginaQuestao';
import { PaginaResolucao } from '../features/resolucao/PaginaResolucao';
import { Pagina404 } from './Pagina404';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PaginaBanco />,
      },
      {
        path: 'questao/:questaoId',
        element: <PaginaQuestao />,
      },
      {
        path: 'questao/:questaoId/resolucao',
        element: <PaginaResolucao />,
      },
      {
        path: '*',
        element: <Pagina404 />,
      },
    ],
  },
]);
