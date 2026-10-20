import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/services/httpClient';
import * as ticketsApi from './ticketsApi';

// Ao voltar para a aba, atualiza a lista se ela estiver "velha" (também revalida a sessão).
const STALE_AFTER_MS = 60_000;

/**
 * Estado e operações dos chamados.
 * Carrega a lista, cancela requisições obsoletas e mantém a lista local sincronizada
 * após criar chamado ou mudar status (sem recarregar tudo a cada ação).
 */
export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const controllerRef = useRef(null);
  const lastFetchRef = useRef(0);

  const refresh = useCallback(async ({ silent = false } = {}) => {
    // Atualização em segundo plano nunca atropela uma carga em andamento.
    if (silent && controllerRef.current) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const data = await ticketsApi.list({ signal: controller.signal });
      const now = new Date();
      setTickets(data);
      setLastUpdated(now);
      lastFetchRef.current = now.getTime();
    } catch (issue) {
      if (issue.name === 'AbortError') return;
      if (!silent) setError(getErrorMessage(issue));
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        if (!silent) setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
    // O controller é trocado a cada carga; no cleanup queremos justamente o mais recente.
    return () => controllerRef.current?.abort();
  }, [refresh]);

  useEffect(() => {
    function refreshIfStale() {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastFetchRef.current < STALE_AFTER_MS) return;
      refresh({ silent: true });
    }

    document.addEventListener('visibilitychange', refreshIfStale);
    window.addEventListener('focus', refreshIfStale);
    return () => {
      document.removeEventListener('visibilitychange', refreshIfStale);
      window.removeEventListener('focus', refreshIfStale);
    };
  }, [refresh]);

  const createTicket = useCallback(async (payload) => {
    const ticket = await ticketsApi.create(payload);
    setTickets((current) => [ticket, ...current]);
    return ticket;
  }, []);

  const loadTicket = useCallback((id) => ticketsApi.get(id), []);

  const addComment = useCallback(async (ticketId, comment) => {
    await ticketsApi.addComment(ticketId, comment);
    return ticketsApi.get(ticketId);
  }, []);

  const changeStatus = useCallback(async (ticketId, status) => {
    await ticketsApi.updateStatus(ticketId, status);
    const updated = await ticketsApi.get(ticketId);
    setTickets((current) => current.map((ticket) => (ticket.id === updated.id ? { ...ticket, ...updated } : ticket)));
    return updated;
  }, []);

  return { tickets, loading, error, lastUpdated, refresh, createTicket, loadTicket, addComment, changeStatus };
}
