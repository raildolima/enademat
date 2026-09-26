import React, { useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  safePolygon,
} from '@floating-ui/react';
import type { Questao, TextoBase } from '../../data/tipos';
import { ConteudoQuestao } from '../../components/ConteudoQuestao';
import { Eye, X } from 'lucide-react';
import styles from './PopupQuestao.module.css';

interface PopupQuestaoProps {
  questao: Questao;
  textoBase?: TextoBase;
}

export const PopupQuestao: React.FC<PopupQuestaoProps> = ({ questao, textoBase }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift({ padding: 8 }),
    ],
  });

  const hover = useHover(context, {
    delay: { open: 120, close: 200 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: true,
  });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  const tituloDialogo = `Enunciado da ${questao.rotulo}`;

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className={styles.btnGatilho}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Eye size={18} aria-hidden="true" />
        <span>Ver questão</span>
      </button>

      {isOpen && (
        <FloatingPortal>
          {/* Não modal: o pop-up entra na ordem de Tab logo após o gatilho, sem prender o foco
              nem roubá-lo ao abrir por hover/foco (initialFocus -1). */}
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={styles.popupCaixa}
              role="dialog"
              aria-label={tituloDialogo}
            >
              <div className={styles.cabecalhoPopup}>
                <span className={styles.tituloPopup}>{tituloDialogo}</span>
                <button
                  type="button"
                  // Fecha como o Esc: o foco devolvido ao gatilho não reabre o pop-up (useFocus).
                  onClick={(e) => context.onOpenChange(false, e.nativeEvent, 'escape-key')}
                  className={styles.btnFechar}
                  aria-label="Fechar pop-up da questão"
                >
                  <X size={16} aria-hidden="true" />
                  Fechar
                </button>
              </div>

              {/* Conteúdo completo somente leitura da questão */}
              <ConteudoQuestao
                questao={questao}
                textoBase={textoBase}
                somenteLeitura={true}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
