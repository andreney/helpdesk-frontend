/**
 * Persistência da sessão (token + usuário).
 *
 * Usa `sessionStorage`: a sessão termina ao fechar a aba. Todo acesso é
 * protegido por try/catch porque o storage pode estar indisponível
 * (modo privado restrito, políticas do navegador, testes em Node).
 */
const TOKEN_KEY = 'helpdesk_token';
const USER_KEY = 'helpdesk_user';

function safely(operation, fallback = null) {
  try {
    return operation();
  } catch {
    return fallback;
  }
}

export const tokenStorage = {
  getToken: () => safely(() => sessionStorage.getItem(TOKEN_KEY)),

  getUser: () => safely(() => JSON.parse(sessionStorage.getItem(USER_KEY) ?? 'null')),

  save({ token, user }) {
    safely(() => {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    });
  },

  clear() {
    safely(() => {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    });
  },
};
