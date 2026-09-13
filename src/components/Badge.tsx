import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variante?: 'padrao' | 'primaria' | 'sucesso' | 'aviso' | 'erro';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variante = 'padrao',
  className = '',
}) => {
  return (
    <span className={`${styles.badge} ${styles[variante]} ${className}`.trim()}>
      {children}
    </span>
  );
};
