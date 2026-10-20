import { API_BASE_URL } from '@/config/env';
import { notifySessionExpired } from './sessionEvents';
import { tokenStorage } from './tokenStorage';

const DEFAULT_ERROR_MESSAGE = 'Não foi possível concluir esta ação.';
const NETWORK_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
const UNAUTHORIZED_STATUSES = [401, 419];

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/** Extrai uma mensagem amigável de qualquer erro lançado pela camada de dados. */
export function getErrorMessage(error) {
  return error?.message || DEFAULT_ERROR_MESSAGE;
}

/** Converte a resposta de erro da API (validação ou mensagem simples) em texto. */
export function extractErrorMessage(payload) {
  if (payload?.errors && typeof payload.errors === 'object') {
    const validation = Object.values(payload.errors).flat().join(' ');
    if (validation) return validation;
  }
  return payload?.message || DEFAULT_ERROR_MESSAGE;
}

/**
 * Cliente HTTP único da aplicação.
 *
 * - Serializa JSON e injeta o token Bearer (a menos que `auth: false`).
 * - Em 401/419 de uma chamada autenticada, avisa a aplicação para encerrar a sessão.
 * - Sempre rejeita com `ApiError` (ou `AbortError`, quando cancelado).
 */
export async function request(path, { method = 'GET', body, signal, auth = true } = {}) {
  const token = auth ? tokenStorage.getToken() : null;
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError(NETWORK_ERROR_MESSAGE);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (token && UNAUTHORIZED_STATUSES.includes(response.status)) notifySessionExpired();
    throw new ApiError(extractErrorMessage(payload), { status: response.status, errors: payload?.errors ?? null });
  }

  return payload;
}
