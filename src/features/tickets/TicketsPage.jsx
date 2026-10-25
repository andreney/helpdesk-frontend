import { useCallback, useMemo, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAuth } from '@/features/auth/useAuth';
import { getErrorMessage } from '@/services/httpClient';
import { formatTime, getFirstName, getGreeting } from '@/utils/formatters';
import CreateTicketModal from './components/CreateTicketModal';
import Pagination from './components/Pagination';
import TicketDetailsDrawer from './components/TicketDetailsDrawer';
import TicketFilters from './components/TicketFilters';
import TicketList from './components/TicketList';
import TicketStats from './components/TicketStats';
import { TICKET_SCOPES } from './constants';
import { toStats } from './ticketSelectors';
import { useTicketFilters } from './useTicketFilters';
import { useTicketSummary } from './useTicketSummary';
import { useTickets } from './useTickets';

export default function TicketsPage({ scope }) {
  const { user, canManage } = useAuth();
  const mine = scope === TICKET_SCOPES.MINE;

  const filters = useTicketFilters({ mine });
  const { tickets, meta, loading, error, lastUpdated, createTicket, loadTicket, addComment, changeStatus } = useTickets(
    filters.params,
  );
  const { summary, refresh: refreshSummary } = useTicketSummary({ mine });
  const stats = useMemo(() => toStats(summary), [summary]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState('');
  const openRequestRef = useRef(0); // descarta respostas de aberturas antigas (cliques rápidos)

  const openTicket = useCallback(
    async (ticketId) => {
      const requestId = ++openRequestRef.current;
      setActionError('');
      try {
        const ticket = await loadTicket(ticketId);
        if (requestId === openRequestRef.current) setActiveTicket(ticket);
      } catch (issue) {
        if (requestId === openRequestRef.current) setActionError(getErrorMessage(issue));
      }
    },
    [loadTicket],
  );

  const closeTicket = useCallback(() => {
    openRequestRef.current += 1;
    setActiveTicket(null);
  }, []);

  async function handleCreate(payload) {
    const ticket = await createTicket(payload);
    setCreating(false);
    setActiveTicket(ticket);
    refreshSummary();
  }

  // Se o drawer for fechado (ou outro chamado aberto) enquanto a requisição está em andamento,
  // a resposta é descartada para não reabrir o painel sozinho.
  async function applyToActiveTicket(action) {
    const requestId = openRequestRef.current;
    const updated = await action(activeTicket.id);
    if (requestId === openRequestRef.current) setActiveTicket(updated);
  }

  const handleComment = (text) => applyToActiveTicket((id) => addComment(id, text));

  async function handleStatusChange(nextStatus) {
    await applyToActiveTicket((id) => changeStatus(id, nextStatus));
    refreshSummary();
  }

  const subtitle = mine || !canManage ? 'Solicitações abertas por você' : 'Todas as solicitações do time';
  const pageError = error || actionError;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="welcome">
            {getGreeting()}, {getFirstName(user?.name) || 'tudo bem'}?
          </p>
          <h1>Central de atendimento</h1>
          <p>Acompanhe as solicitações e mantenha tudo em movimento.</p>
        </div>
        <Button icon="plus" onClick={() => setCreating(true)}>
          Novo chamado
        </Button>
      </div>

      {pageError && (
        <div className="page-error">
          <ErrorMessage>{pageError}</ErrorMessage>
        </div>
      )}

      <TicketStats stats={stats} />

      <section className="ticket-panel" aria-labelledby="tickets-heading">
        <div className="panel-head">
          <div>
            <h2 id="tickets-heading">Chamados recentes</h2>
            <p>{subtitle}</p>
          </div>
          <TicketFilters
            query={filters.searchInput}
            onQueryChange={filters.setSearchInput}
            status={filters.status}
            onStatusChange={filters.setStatus}
          />
        </div>

        <TicketList
          tickets={tickets}
          isInitialLoading={loading && tickets.length === 0}
          filtered={filters.hasActiveFilters}
          busy={loading}
          onOpen={openTicket}
          onCreate={() => setCreating(true)}
        />

        <div className="panel-foot" aria-live="polite">
          <span className="panel-foot-count">
            {meta.total === 0 ? (
              'Nenhuma solicitação'
            ) : (
              <>
                Exibindo{' '}
                <strong>
                  {meta.from}–{meta.to}
                </strong>{' '}
                de <strong>{meta.total}</strong> solicitações
              </>
            )}
          </span>
          <Pagination page={filters.page} lastPage={meta.lastPage} onPageChange={filters.setPage} />
          {lastUpdated && <span className="panel-foot-updated">Atualizado às {formatTime(lastUpdated)}</span>}
        </div>
      </section>

      {creating && <CreateTicketModal onClose={() => setCreating(false)} onCreate={handleCreate} />}

      {activeTicket && (
        <TicketDetailsDrawer
          key={activeTicket.id}
          ticket={activeTicket}
          canManage={canManage}
          onClose={closeTicket}
          onComment={handleComment}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
