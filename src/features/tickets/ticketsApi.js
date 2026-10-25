import { request } from '@/services/httpClient';
import { ALL_STATUSES, PAGE_SIZE } from './constants';

// A API pode embrulhar o recurso em { data: ... } ou devolvê-lo diretamente.
const unwrap = (result) => result?.data ?? result;

/** Monta a query string da listagem, omitindo os filtros vazios. */
export function buildListQuery({ page = 1, perPage = PAGE_SIZE, status = ALL_STATUSES, search = '', mine = false } = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (status && status !== ALL_STATUSES) params.set('status', status);
  if (search) params.set('search', search);
  if (mine) params.set('mine', '1');
  return params.toString();
}

/** Normaliza o bloco `meta` da paginação do Laravel (e tolera respostas sem paginação). */
export function normalizeMeta(meta, itemCount = 0) {
  return {
    currentPage: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? PAGE_SIZE,
    total: meta?.total ?? itemCount,
    from: meta?.from ?? (itemCount > 0 ? 1 : 0),
    to: meta?.to ?? itemCount,
  };
}

/** Uma página de chamados: `{ items, meta }`. */
export async function list({ signal, ...query } = {}) {
  const result = await request(`/tickets?${buildListQuery(query)}`, { signal });
  const items = Array.isArray(result?.data) ? result.data : [];
  return { items, meta: normalizeMeta(result?.meta, items.length) };
}

/** Totais por status: `{ total, by_status: { OPEN, IN_PROGRESS, WAITING, CLOSED } }`. */
export async function summary({ mine = false, signal } = {}) {
  const result = await request(`/tickets/summary${mine ? '?mine=1' : ''}`, { signal });
  return result?.data ?? null;
}

export async function get(id, { signal } = {}) {
  return unwrap(await request(`/tickets/${id}`, { signal }));
}

export async function create(payload) {
  return unwrap(await request('/tickets', { method: 'POST', body: payload }));
}

export function addComment(ticketId, comment) {
  return request(`/tickets/${ticketId}/comments`, { method: 'POST', body: { comment } });
}

export function updateStatus(ticketId, status) {
  return request(`/tickets/${ticketId}/status`, { method: 'PATCH', body: { status } });
}
