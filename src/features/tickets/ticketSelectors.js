import { ALL_STATUSES, STATUS, TICKET_SCOPES } from './constants';

const LOCALE = 'pt-BR';

function normalize(value) {
  return String(value ?? '').toLocaleLowerCase(LOCALE);
}

/** Aplica escopo ("meus chamados"), filtro de status e busca textual. */
export function filterTickets(tickets, { scope = TICKET_SCOPES.ALL, userId, status = ALL_STATUSES, query = '' } = {}) {
  const text = normalize(query).trim();

  return tickets.filter((ticket) => {
    if (scope === TICKET_SCOPES.MINE && ticket.user?.id !== userId) return false;
    if (status !== ALL_STATUSES && ticket.status !== status) return false;
    if (!text) return true;

    return [ticket.title, ticket.category?.name, ticket.user?.name, `#${ticket.id}`].some((value) =>
      normalize(value).includes(text),
    );
  });
}

/** Contagens exibidas nos cards de resumo. */
export function getTicketStats(tickets) {
  return tickets.reduce(
    (stats, ticket) => {
      stats.total += 1;
      if (ticket.status === STATUS.OPEN) stats.open += 1;
      if (ticket.status === STATUS.IN_PROGRESS) stats.inProgress += 1;
      if (ticket.status === STATUS.CLOSED) stats.closed += 1;
      return stats;
    },
    { total: 0, open: 0, inProgress: 0, closed: 0 },
  );
}
