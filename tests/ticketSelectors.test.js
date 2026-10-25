import { describe, expect, it } from 'vitest';
import { STATUS, STATUS_TRANSITIONS } from '@/features/tickets/constants';
import { toStats } from '@/features/tickets/ticketSelectors';

describe('toStats', () => {
  it('converte o resumo da API nos números dos cards', () => {
    const summary = { total: 21, by_status: { OPEN: 18, IN_PROGRESS: 1, WAITING: 1, CLOSED: 1 } };

    expect(toStats(summary)).toEqual({ total: 21, open: 18, inProgress: 1, closed: 1 });
  });

  it('status ausentes viram zero', () => {
    expect(toStats({ total: 2, by_status: { OPEN: 2 } })).toEqual({ total: 2, open: 2, inProgress: 0, closed: 0 });
  });

  it('sem resumo devolve nulos (os cards mostram traço)', () => {
    expect(toStats(null)).toEqual({ total: null, open: null, inProgress: null, closed: null });
    expect(toStats({})).toEqual({ total: null, open: null, inProgress: null, closed: null });
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
