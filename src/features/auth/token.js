/**
 * Lê a data de expiração (`exp`) de um JWT, em milissegundos.
 * Retorna `null` se o token não for um JWT ou não tiver `exp` (ex.: tokens opacos).
 * Atenção: apenas leitura do payload — a validade real é sempre decidida pela API.
 */
export function getTokenExpiration(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}
