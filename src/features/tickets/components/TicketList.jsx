import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import TicketRow from './TicketRow';

const COLUMN_COUNT = 6;

function EmptyState({ filtered, onCreate }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">
        <Icon name={filtered ? 'search' : 'list'} />
      </span>
      <strong>{filtered ? 'Nenhum chamado encontrado' : 'Sua fila está pronta'}</strong>
      <p>
        {filtered
          ? 'Ajuste a busca ou o filtro para encontrar uma solicitação.'
          : 'Quando uma solicitação for aberta, ela aparecerá aqui para você acompanhar.'}
      </p>
      {!filtered && (
        <Button variant="link" onClick={onCreate} icon="arrow-right">
          Abrir primeiro chamado
        </Button>
      )}
    </div>
  );
}

/**
 * Tabela de chamados.
 * `isInitialLoading`: primeira carga (ainda não há nada para mostrar).
 * `filtered`: há busca/filtro ativo (muda a mensagem de "vazio").
 * `busy`: uma nova página está sendo carregada (a anterior continua visível, esmaecida).
 */
export default function TicketList({ tickets, isInitialLoading, filtered, busy = false, onOpen, onCreate }) {
  let body;
  if (isInitialLoading) {
    body = (
      <tr>
        <td className="empty-cell" colSpan={COLUMN_COUNT}>
          <div role="status">Carregando chamados…</div>
        </td>
      </tr>
    );
  } else if (tickets.length === 0) {
    body = (
      <tr>
        <td colSpan={COLUMN_COUNT}>
          <EmptyState filtered={filtered} onCreate={onCreate} />
        </td>
      </tr>
    );
  } else {
    body = tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onOpen={onOpen} />);
  }

  return (
    <div className="table-scroll" aria-busy={busy}>
      <table>
        <caption className="sr-only">Lista de chamados</caption>
        <thead>
          <tr>
            <th scope="col">Solicitação</th>
            <th scope="col">Solicitante</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Status</th>
            <th scope="col">Criado em</th>
            <th scope="col">
              <span className="sr-only">Abrir</span>
            </th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
