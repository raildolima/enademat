import React from 'react';
import { Outlet, Link } from 'react-router';
import { Sigma } from 'lucide-react';
import styles from './Layout.module.css';

const BASE = import.meta.env.BASE_URL || './';
const LOGO_POSITIVO = `${BASE}marca/ufms-assinatura-horizontal-positivo.webp`;
const LOGO_NEGATIVO = `${BASE}marca/ufms-assinatura-horizontal-negativo.webp`;
const ALT_LOGO = 'UFMS — Universidade Federal de Mato Grosso do Sul';

/** Assinatura horizontal da UFMS: versão positiva no fundo claro e negativa no escuro, sem distorção (manual da marca). */
const LogoUfms: React.FC<{ sempreNegativo?: boolean; className?: string }> = ({ sempreNegativo = false, className }) =>
  sempreNegativo ? (
    <img src={LOGO_NEGATIVO} alt={ALT_LOGO} width={348} height={120} className={className} />
  ) : (
    <picture>
      <source srcSet={LOGO_NEGATIVO} media="(prefers-color-scheme: dark)" width={348} height={120} />
      <img src={LOGO_POSITIVO} alt={ALT_LOGO} width={343} height={120} className={className} />
    </picture>
  );

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
          <LogoUfms className={styles.logoUfms} />
          <span className={styles.divisor} aria-hidden="true" />
          <Link to="/" className={styles.logoLink} aria-label="Ir para página inicial do Simulador ENADE">
            <span className={styles.logoIcone} aria-hidden="true">
              <Sigma size={22} strokeWidth={2.25} />
            </span>
            <span>
              <span className={styles.logoTexto}>Simulador ENADE</span>
              <span className={styles.logoSubtexto}>Matemática · Licenciatura</span>
            </span>
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
          <LogoUfms sempreNegativo className={styles.logoRodape} />
          <p>
            Questões: INEP/MEC — ENADE 2021, 2025 e 2026. Resoluções elaboradas para fins educacionais.
          </p>
          <p className={styles.rodapeAviso}>
            Site não oficial. Créditos das fontes das figuras preservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
