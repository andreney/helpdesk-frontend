import { request } from '@/services/httpClient';

export function login({ email, password }) {
  return request('/login', { method: 'POST', body: { email, password }, auth: false });
}

export function logout() {
  return request('/logout', { method: 'POST' });
}
