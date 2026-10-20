import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onSessionExpired } from '@/services/sessionEvents';
import { tokenStorage } from '@/services/tokenStorage';
import * as authApi from './authApi';
import { canManageTickets, getRoleLabel, normalizeRole } from './roles';
import { getTokenExpiration } from './token';

export const AuthContext = createContext(null);

// setTimeout aceita no máximo 2^31 - 1 ms; acima disso dispararia imediatamente.
const MAX_TIMEOUT_MS = 2_147_483_647;

function readStoredSession() {
  const token = tokenStorage.getToken();
  const user = tokenStorage.getUser();
  return token && user ? { token, user } : { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setSession({ token: null, user: null });
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    tokenStorage.save({ token, user });
    setSession({ token, user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Falha ao avisar a API não deve impedir o logout local.
      console.error('Erro ao encerrar a sessão na API:', error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  // 401/419 em qualquer requisição autenticada encerra a sessão.
  useEffect(() => onSessionExpired(clearSession), [clearSession]);

  // Se o token for um JWT, encerra a sessão exatamente quando ele expirar.
  useEffect(() => {
    if (!session.token) return undefined;
    const expiresAt = getTokenExpiration(session.token);
    if (!expiresAt) return undefined;

    let timeoutId;
    const check = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) clearSession();
      else timeoutId = window.setTimeout(check, Math.min(remaining, MAX_TIMEOUT_MS));
    };
    check();
    return () => window.clearTimeout(timeoutId);
  }, [session.token, clearSession]);

  const value = useMemo(() => {
    const role = normalizeRole(session.user?.role);
    return {
      user: session.user,
      isAuthenticated: Boolean(session.token),
      role,
      roleLabel: getRoleLabel(role),
      canManage: canManageTickets(role),
      login,
      logout,
    };
  }, [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
