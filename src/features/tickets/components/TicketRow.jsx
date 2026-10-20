import Avatar from '@/components/ui/Avatar';
import Icon from '@/components/ui/Icon';
import { formatDate } from '@/utils/formatters';
import { PriorityBadge, StatusBadge } from './StatusBadge';

/**
 * O título é um <button>: garante foco e Enter/Espaço por teclado e leitura correta
 * em leitores de tela. O clique na linha inteira é só uma conveniência para o mouse.
 */
export default function TicketRow({ ticket, onOpen }) {
  return (
    // O clique na linha é só conveniência para o mouse; o acesso por teclado/leitor de tela é o botão do título.
    <tr onClick={() => onOpen(ticket.id)}>
      <td>
        <div className="ticket-title">
          <span className="ticket-icon" aria-hidden="true">
            <Icon name="file" />
          </span>
          <div>
            <button
              type="button"
              className="ticket-link"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(ticket.id);
              }}
            >
              <strong>{ticket.title}</strong>
            </button>
            <small>
              #{ticket.id}
              <i aria-hidden="true">·</i>
              {ticket.category?.name || 'Sem categoria'}
            </small>
          </div>
        </div>
      </td>
      <td>
        <div className="requester">
          <Avatar small name={ticket.user?.name} />
          {ticket.user?.name || '—'}
        </div>
      </td>
      <td>
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td>
        <StatusBadge status={ticket.status} />
      </td>
      <td className="date-cell">{formatDate(ticket.created_at)}</td>
      <td className="chevron" aria-hidden="true">
        <Icon name="chevron-right" />
      </td>
    </tr>
  );
}
