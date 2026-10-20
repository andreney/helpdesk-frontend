/**
 * Pequeno barramento para avisar a aplicação que a sessão expirou (401/419).
 * Mantém o cliente HTTP desacoplado do React e da feature de autenticação.
 */
const listeners = new Set();

export function onSessionExpired(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifySessionExpired() {
  listeners.forEach((listener) => listener());
}
