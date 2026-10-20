import Dialog from './Dialog';

/** Painel lateral. O conteúdo (cabeçalho, corpo, rodapé) é responsabilidade de quem usa. */
export default function Drawer({ labelledBy, onClose, children }) {
  return (
    <Dialog labelledBy={labelledBy} onClose={onClose} scrimClassName="drawer-scrim" className="drawer">
      {children}
    </Dialog>
  );
}
