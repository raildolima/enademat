/**
 * Gabaritos de referência oficial da Seção 0.7 de docs/ESPECIFICACAO.md.
 * Dupla conferência: nenhuma prova pode divergir destes gabaritos.
 */

export const GABARITO_REF_2021 = (
  'E C B B A A C D ' +
  'E D E D B A B C A C D C B A A B E C A D C B D A C C E'
).split(' ');

export const GABARITO_REF_2025_P1 = (
  'D B C D C A B D D D ' +
  'A D C B A C A A C C ' +
  'C C A C A D B B B A ' +
  'B D B D C D D A C A ' +
  'C B B A C B A D D C ' +
  'A C A A C A C A D C ' +
  'A A D D B B D D D B ' +
  'B A C B C A D B B C'
).split(' ');

export const GABARITO_REF_2025_P5 = (
  'A B D B C B D B B D ' +
  'D C A D B D B A A A ' +
  'B D A B C C C A C B ' +
  'D A C A C B A C B A ' +
  'B C B D B D A C A C ' +
  'B C D B A C D C D C ' +
  'D A C D B A B C D B ' +
  'D B A B D B A D A D'
).split(' ');

export function obterGabaritoReferencia(provaId: string): Record<string, string> {
  const mapa: Record<string, string> = {};
  if (provaId === '2021-licenciatura') {
    GABARITO_REF_2021.forEach((letra, idx) => {
      mapa[String(idx + 1)] = letra;
    });
  } else if (provaId === '2025-prova1') {
    GABARITO_REF_2025_P1.forEach((letra, idx) => {
      mapa[String(idx + 1)] = letra;
    });
  } else if (provaId === '2025-prova5') {
    GABARITO_REF_2025_P5.forEach((letra, idx) => {
      mapa[String(idx + 1)] = letra;
    });
  }
  return mapa;
}
