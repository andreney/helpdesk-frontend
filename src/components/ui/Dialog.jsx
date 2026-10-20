import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '@/hooks/useDialog';

/**
 * Base acessível para Modal e Drawer: portal, role="dialog", aria-modal,
 * foco preso, Esc para fechar e clique no fundo para fechar.
 */
export default function Dialog({ labelledBy, onClose, scrimClassName, className, children }) {
  const dialogRef = useRef(null);
  useDialog(dialogRef, onClose);

  return createPortal(
    // Clicar no fundo fecha o diálogo (conveniência do mouse); o teclado fecha com Esc via useDialog.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={scrimClassName}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section ref={dialogRef} className={className} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}>
        {children}
      </section>
    </div>,
    document.body,
  );
}
