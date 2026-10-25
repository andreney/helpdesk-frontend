import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOnRefocus } from '@/hooks/useOnRefocus';
import { getErrorMessage } from '@/services/httpClient';
import { PAGE_SIZE } from './constants';
import * as ticketsApi from './ticketsApi';

// Ao voltar para a aba, atualiza a lista se estiver "velha" (também revalida a sessão).
const STALE_AFTER_MS = 60_000;

const EMPTY_META = { currentPage: 1, lastPage: 1, perPage: PAGE_SIZE, total: 0, from: 0, to: 0 };

/**
 * Uma página de chamados, conforme a busca/filtros/página recebidos.
 * Recarrega sozinho quando eles mudam, cancela requisições obsoletas e
 * recarrega a lista após criar um chamado ou mudar seu status.
 */
export function useTickets({ page, perPage, status, search, mine }) {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState(EMPTY_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const controllerRef = useRef(null);
  const lastFetchRef = useRef(0);

  // `query` só muda de identidade quando algum valor muda (evita recarregar a cada render).
  const queryKey = JSON.stringify([page, perPage, status, search, mine]);
  const query = useMemo(() => {
    const [nextPage, nextPerPage, nextStatus, nextSearch, nextMine] = JSON.parse(queryKey);
    return { page: nextPage, perPage: nextPerPage, status: nextStatus, search: nextSearch, mine: nextMine };
  }, [queryKey]);

  const load = useCallback(
    async ({ background = false } = {}) => {
      // Atualização em segundo plano nunca atropela uma carga em andamento.
      if (background && controllerRef.current) return;

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (!background) {
        setLoading(true);
        setError('');
      }

      try {
        const result = await ticketsApi.list({ ...query, signal: controller.signal });
        const now = new Date();
        setTickets(result.items);
        setMeta(result.meta);
        setLastUpdated(now);
        lastFetchRef.current = now.getTime();
      } catch (issue) {
        if (issue.name === 'AbortError') return;
        if (!background) setError(getErrorMessage(issue));
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          if (!background) setLoading(false);
        }
      }
    },
    [query],
  );

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  useOnRefocus(
    useCallback(() => {
      if (Date.now() - lastFetchRef.current < STALE_AFTER_MS) return;
      load({ background: true });
    }, [load]),
  );

  const createTicket = useCallback(
    async (payload) => {
      const ticket = await ticketsApi.create(payload);
      load();
      return ticket;
    },
    [load],
  );

  const loadTicket = useCallback((id) => ticketsApi.get(id), []);

  const addComment = useCallback(async (ticketId, comment) => {
    await ticketsApi.addComment(ticketId, comment);
    return ticketsApi.get(ticketId);
  }, []);

  const changeStatus = useCallback(
    async (ticketId, nextStatus) => {
      await ticketsApi.updateStatus(ticketId, nextStatus);
      const updated = await ticketsApi.get(ticketId);
      load();
      return updated;
    },
    [load],
  );

  return { tickets, meta, loading, error, lastUpdated, createTicket, loadTicket, addComment, changeStatus };
}
