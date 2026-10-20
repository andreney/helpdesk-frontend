import { useId } from 'react';
import Dialog from './Dialog';
import Icon from './Icon';

export default function Modal({ title, subtitle, onClose, footer, children }) {
  const titleId = useId();

  return (
    <Dialog labelledBy={titleId} onClose={onClose} scrimClassName="modal-scrim" className="modal">
      <header>
        <div>
          <h2 id={titleId}>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
      </header>
      <div className="modal-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </Dialog>
  );
}
