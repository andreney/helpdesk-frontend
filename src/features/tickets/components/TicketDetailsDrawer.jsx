import { useId, useState } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Icon from '@/components/ui/Icon';
import { getErrorMessage } from '@/services/httpClient';
import { formatDate } from '@/utils/formatters';
import { STATUS_ACTION_LABELS, STATUS_TRANSITIONS } from '../constants';
import TicketComments from './TicketComments';
import { PriorityBadge, StatusBadge } from './StatusBadge';

/**
 * Detalhes do chamado. Use `key={ticket.id}` ao renderizar para reiniciar o estado local
 * (rascunho de comentário, erros) ao trocar de chamado.
 *
 * `onComment(text)` e `onStatusChange(status)` devem retornar uma Promise.
 */
export default function TicketDetailsDrawer({ ticket, canManage, onClose, onComment, onStatusChange }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const titleId = useId();
  const transitions = STATUS_TRANSITIONS[ticket.status] ?? [];

  async function run(action) {
    setBusy(true);
    setError('');
    try {
      await action();
      return true;
    } catch (issue) {
      setError(getErrorMessage(issue));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const comment = text.trim();
    if (!comment) return;
    if (await run(() => onComment(comment))) setText('');
  }

  return (
    <Drawer labelledBy={titleId} onClose={onClose}>
      <header>
        <div>
          <p>CHAMADO #{ticket.id}</p>
          <h2 id={titleId}>{ticket.title}</h2>
        </div>
        <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
      </header>

      <div className="detail-badges">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <span>{formatDate(ticket.created_at)}</span>
      </div>

      <div className="drawer-body">
        <ErrorMessage>{error}</ErrorMessage>

        <dl className="meta-grid">
          <div>
            <dt>SOLICITANTE</dt>
            <dd>{ticket.user?.name || '—'}</dd>
          </div>
          <div>
            <dt>CATEGORIA</dt>
            <dd>{ticket.category?.name || '—'}</dd>
          </div>
        </dl>

        <section className="description">
          <h3>DESCRIÇÃO</h3>
          <p>{ticket.description || 'Nenhuma descrição informada.'}</p>
        </section>

        {canManage && transitions.length > 0 && (
          <section className="next-step" aria-label="Próxima etapa">
            <strong>Próxima etapa</strong>
            <div>
              {transitions.map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  disabled={busy}
                  onClick={() => run(() => onStatusChange(status))}
                >
                  {STATUS_ACTION_LABELS[status]}
                </Button>
              ))}
            </div>
          </section>
        )}

        <TicketComments comments={ticket.comments} />
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          aria-label="Escreva uma resposta"
          rows={2}
          placeholder="Escreva uma resposta…"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="send-button" aria-label="Enviar comentário" disabled={busy || !text.trim()}>
          <Icon name="send" />
        </button>
        <small>Sua resposta ficará visível na conversa do chamado.</small>
      </form>
    </Drawer>
  );
}
