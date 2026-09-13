import React from 'react';
import { Link } from 'react-router';

export const Pagina404: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--espaco-12) var(--espaco-4)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--espaco-2)' }}>404</h1>
      <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--espaco-4)', color: 'var(--cor-texto-secundario)' }}>
        Página não encontrada
      </h2>
      <p style={{ marginBottom: 'var(--espaco-6)', color: 'var(--cor-texto-atenuado)' }}>
        O endereço informado não corresponde a nenhuma questão ou prova válida.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          padding: 'var(--espaco-2) var(--espaco-4)',
          backgroundColor: 'var(--cor-primaria)',
          color: 'var(--cor-texto-inverso)',
          borderRadius: 'var(--raio-md)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Voltar ao Banco de Questões
      </Link>
    </div>
  );
};
