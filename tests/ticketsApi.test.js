import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '@/config/env';
import { buildListQuery, list, normalizeMeta, summary } from '@/features/tickets/ticketsApi';

const realFetch = globalThis.fetch;

function mockFetch(payload) {
  const urls = [];
  globalThis.fetch = async (url) => {
    urls.push(url);
    return { ok: true, status: 200, json: async () => payload };
  };
  return urls;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('buildListQuery', () => {
  it('envia página e tamanho e omite filtros vazios', () => {
    expect(buildListQuery({ page: 2 })).toBe('page=2&per_page=15');
  });

  it('inclui status, busca e mine quando informados', () => {
    expect(buildListQuery({ page: 1, perPage: 10, status: 'OPEN', search: 'vpn lenta', mine: true })).toBe(
      'page=1&per_page=10&status=OPEN&search=vpn+lenta&mine=1',
    );
  });

  it('o status "ALL" significa sem filtro', () => {
    expect(buildListQuery({ status: 'ALL' })).toBe('page=1&per_page=15');
  });
});

describe('normalizeMeta', () => {
  it('converte o meta do Laravel', () => {
    const meta = { current_page: 2, last_page: 3, per_page: 15, total: 31, from: 16, to: 30 };

    expect(normalizeMeta(meta)).toEqual({ currentPage: 2, lastPage: 3, perPage: 15, total: 31, from: 16, to: 30 });
  });

  it('tolera resposta sem paginação e lista vazia (from/to nulos)', () => {
    expect(normalizeMeta(undefined, 4)).toEqual({ currentPage: 1, lastPage: 1, perPage: 15, total: 4, from: 1, to: 4 });
    expect(normalizeMeta({ total: 0, from: null, to: null }, 0)).toEqual({
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
      from: 0,
      to: 0,
    });
  });
});

describe('list e summary', () => {
  it('list devolve os itens e o meta normalizado', async () => {
    const urls = mockFetch({
      data: [{ id: 16 }],
      meta: { current_page: 2, last_page: 2, per_page: 15, total: 16, from: 16, to: 16 },
    });

    const result = await list({ page: 2, status: 'OPEN' });

    expect(urls[0]).toBe(`${API_BASE_URL}/tickets?page=2&per_page=15&status=OPEN`);
    expect(result.items).toEqual([{ id: 16 }]);
    expect(result.meta.lastPage).toBe(2);
  });

  it('summary lê o bloco data e respeita mine', async () => {
    const urls = mockFetch({ data: { total: 2, by_status: { OPEN: 2 } } });

    expect(await summary({ mine: true })).toEqual({ total: 2, by_status: { OPEN: 2 } });
    expect(urls[0]).toBe(`${API_BASE_URL}/tickets/summary?mine=1`);
  });
});
