import { describe, expect, it } from 'vitest';
import { ALL_STATUSES, STATUS, STATUS_TRANSITIONS, TICKET_SCOPES } from '@/features/tickets/constants';
import { filterTickets, getTicketStats } from '@/features/tickets/ticketSelectors';

const tickets = [
  { id: 1, title: 'Não consigo acessar o e-mail', status: STATUS.OPEN, user: { id: 10, name: 'Ana' }, category: { name: 'Acesso' } },
  { id: 2, title: 'Impressora parada', status: STATUS.IN_PROGRESS, user: { id: 11, name: 'Bruno' }, category: { name: 'Hardware' } },
  { id: 3, title: 'Solicitar licença', status: STATUS.CLOSED, user: { id: 10, name: 'Ana' }, category: null },
  { id: 4, title: 'VPN lenta', status: STATUS.WAITING, user: { id: 12, name: 'Carla' }, category: { name: 'Rede' } },
];

const ids = (list) => list.map((ticket) => ticket.id);

describe('filterTickets', () => {
  it('sem filtros devolve tudo', () => {
    expect(ids(filterTickets(tickets))).toEqual([1, 2, 3, 4]);
  });

  it('escopo "meus chamados" mantém só os do usuário', () => {
    expect(ids(filterTickets(tickets, { scope: TICKET_SCOPES.MINE, userId: 10 }))).toEqual([1, 3]);
  });

  it('filtra por status', () => {
    expect(ids(filterTickets(tickets, { status: STATUS.CLOSED }))).toEqual([3]);
    expect(ids(filterTickets(tickets, { status: ALL_STATUSES }))).toEqual([1, 2, 3, 4]);
  });

  it('busca em título, categoria, solicitante e número, sem diferenciar maiúsculas', () => {
    expect(ids(filterTickets(tickets, { query: 'IMPRESSORA' }))).toEqual([2]);
    expect(ids(filterTickets(tickets, { query: 'rede' }))).toEqual([4]);
    expect(ids(filterTickets(tickets, { query: 'ana' }))).toEqual([1, 3]);
    expect(ids(filterTickets(tickets, { query: '#2' }))).toEqual([2]);
  });

  it('combina escopo, status e busca', () => {
    expect(ids(filterTickets(tickets, { scope: TICKET_SCOPES.MINE, userId: 10, status: STATUS.OPEN, query: 'e-mail' }))).toEqual([1]);
  });
});

describe('getTicketStats', () => {
  it('conta por status', () => {
    expect(getTicketStats(tickets)).toEqual({ total: 4, open: 1, inProgress: 1, closed: 1 });
    expect(getTicketStats([])).toEqual({ total: 0, open: 0, inProgress: 0, closed: 0 });
  });
});

describe('fluxo de status', () => {
  it('chamado concluído não tem próxima etapa', () => {
    expect(STATUS_TRANSITIONS[STATUS.CLOSED]).toEqual([]);
  });

  it('todo destino de transição é um status válido', () => {
    Object.values(STATUS_TRANSITIONS)
      .flat()
      .forEach((target) => expect(Object.values(STATUS).includes(target)).toBe(true));
  });
});
