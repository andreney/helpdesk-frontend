import { request } from '@/services/httpClient';

/** Categorias ativas, as únicas aceitas na abertura de chamados. */
export async function list({ signal } = {}) {
  const result = await request('/categories', { signal });
  return Array.isArray(result?.data) ? result.data : [];
}
