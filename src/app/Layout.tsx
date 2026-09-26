import React from 'react';
import { Outlet, Link } from 'react-router';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  // Com createHashRouter, seguir "#conteudo-principal" viraria navegação de rota (404).
  // O skip-link apenas move o foco para o <main>.
  const pularParaConteudo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('conteudo-principal')?.focus();
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Acessibilidade: Skip link para teclado */}
      <a href="#conteudo-principal" className="skip-link" onClick={pularParaConteudo}>
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho Superior */}
      <header className={styles.cabecalhoApp} role="banner">
        <div className={styles.cabecalhoConteudo}>
          <Link to="/" className={styles.logoLink} aria-label="Ir para página inicial do Simulador ENADE">
            <span className={styles.logoIcone} aria-hidden="true">📐</span>
            <div>
              <span className={styles.logoTexto}>Simulador ENADE</span>
              <span className={styles.logoSubtexto}>Matemática · Licenciatura</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main id="conteudo-principal" className={styles.conteudoPrincipal} role="main" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Rodapé Institucional com Créditos e Aviso Legal (RF09) */}
      <footer className={styles.rodapeApp} role="contentinfo">
        <div className={styles.rodapeConteudo}>
          <p>
            Questões: INEP/MEC — ENADE 2021 e 2025. Resoluções elaboradas para fins educacionais.
          </p>
          <p className={styles.rodapeAviso}>
            Site não oficial. Créditos das fontes das figuras preservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
