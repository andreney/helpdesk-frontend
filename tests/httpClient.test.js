import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '@/config/env';
import { ApiError, extractErrorMessage, request } from '@/services/httpClient';
import { onSessionExpired } from '@/services/sessionEvents';

const realFetch = globalThis.fetch;

function mockFetch(status, payload) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: status >= 200 && status < 300, status, json: async () => payload };
  };
  return calls;
}

async function catchError(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('A promise deveria ter sido rejeitada.');
}

beforeEach(() => {
  const store = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
  delete globalThis.sessionStorage;
});

describe('extractErrorMessage', () => {
  it('junta mensagens de validação', () => {
    expect(extractErrorMessage({ errors: { email: ['E-mail inválido.'], password: ['Senha curta.'] } })).toBe(
      'E-mail inválido. Senha curta.',
    );
  });

  it('usa message quando não há validação', () => {
    expect(extractErrorMessage({ message: 'Credenciais inválidas.' })).toBe('Credenciais inválidas.');
  });

  it('usa mensagem padrão quando a resposta não ajuda', () => {
    expect(extractErrorMessage({})).toBe('Não foi possível concluir esta ação.');
    expect(extractErrorMessage(null)).toBe('Não foi possível concluir esta ação.');
  });
});

describe('request', () => {
  it('serializa o corpo em JSON e envia o token', async () => {
    sessionStorage.setItem('helpdesk_token', 'abc123');
    const calls = mockFetch(200, { data: [] });

    await request('/tickets', { method: 'POST', body: { title: 'Olá' } });

    expect(calls[0].url).toBe(`${API_BASE_URL}/tickets`);
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.body).toBe('{"title":"Olá"}');
    expect(calls[0].init.headers.Authorization).toBe('Bearer abc123');
    expect(calls[0].init.headers['Content-Type']).toBe('application/json');
  });

  it('não envia o token com auth: false', async () => {
    sessionStorage.setItem('helpdesk_token', 'abc123');
    const calls = mockFetch(200, {});

    await request('/login', { method: 'POST', body: {}, auth: false });

    expect(calls[0].init.headers.Authorization).toBeUndefined();
  });

  it('rejeita com ApiError contendo a mensagem da API', async () => {
    mockFetch(422, { errors: { title: ['O título é obrigatório.'] } });

    const error = await catchError(request('/tickets', { method: 'POST', body: {} }));

    expect(error instanceof ApiError).toBe(true);
    expect(error.message).toBe('O título é obrigatório.');
    expect(error.status).toBe(422);
  });

  it('avisa a sessão expirada em 401 com token', async () => {
    sessionStorage.setItem('helpdesk_token', 'abc123');
    mockFetch(401, { message: 'Unauthenticated.' });
    let expired = 0;
    const unsubscribe = onSessionExpired(() => (expired += 1));

    await catchError(request('/tickets'));
    unsubscribe();

    expect(expired).toBe(1);
  });

  it('401 sem token (ex.: senha errada no login) não derruba a sessão', async () => {
    mockFetch(401, { message: 'Credenciais inválidas.' });
    let expired = 0;
    const unsubscribe = onSessionExpired(() => (expired += 1));

    const error = await catchError(request('/login', { method: 'POST', body: {}, auth: false }));
    unsubscribe();

    expect(error.message).toBe('Credenciais inválidas.');
    expect(expired).toBe(0);
  });

  it('converte falha de rede em ApiError amigável', async () => {
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch');
    };

    const error = await catchError(request('/tickets'));

    expect(error instanceof ApiError).toBe(true);
    expect(error.message).toMatch(/conectar ao servidor/);
  });
});
