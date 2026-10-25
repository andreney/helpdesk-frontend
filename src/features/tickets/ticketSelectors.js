import { STATUS } from './constants';

const EMPTY_STATS = Object.freeze({ total: null, open: null, inProgress: null, closed: null });

/**
 * Converte o resumo da API (`GET /tickets/summary`) nos números dos cards.
 * Sem resumo (ainda carregando ou falhou), os valores são `null` e os cards mostram "—".
 */
export function toStats(summary) {
  const byStatus = summary?.by_status;
  if (!byStatus) return EMPTY_STATS;

  return {
    total: summary.total ?? 0,
    open: byStatus[STATUS.OPEN] ?? 0,
    inProgress: byStatus[STATUS.IN_PROGRESS] ?? 0,
    closed: byStatus[STATUS.CLOSED] ?? 0,
  };
}
