import { request } from '@/services/httpClient';

// A API pode embrulhar o recurso em { data: ... } ou devolvê-lo diretamente.
const unwrap = (result) => result?.data ?? result;

export async function list({ signal } = {}) {
  const result = await request('/tickets', { signal });
  return Array.isArray(result?.data) ? result.data : [];
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
