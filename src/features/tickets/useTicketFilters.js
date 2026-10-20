import { useMemo, useState } from 'react';
import { ALL_STATUSES } from './constants';
import { filterTickets } from './ticketSelectors';

/** Estado dos filtros (busca e status) + lista filtrada. O escopo vem de fora (navegação). */
export function useTicketFilters(tickets, { scope, userId }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);

  const scoped = useMemo(() => filterTickets(tickets, { scope, userId }), [tickets, scope, userId]);
  const filtered = useMemo(() => filterTickets(scoped, { status, query }), [scoped, status, query]);
  const hasActiveFilters = status !== ALL_STATUSES || query.trim() !== '';

  return { query, setQuery, status, setStatus, scoped, filtered, hasActiveFilters };
}
