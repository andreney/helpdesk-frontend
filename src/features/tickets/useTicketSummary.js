import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnRefocus } from '@/hooks/useOnRefocus';
import * as ticketsApi from './ticketsApi';

const STALE_AFTER_MS = 60_000;

/**
 * Totais por status para os cards de resumo (`GET /tickets/summary`).
 * Chame `refresh()` depois de criar um chamado ou mudar seu status.
 */
export function useTicketSummary({ mine }) {
  const [summary, setSummary] = useState(null);
  const controllerRef = useRef(null);
  const lastFetchRef = useRef(0);

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setSummary(await ticketsApi.summary({ mine, signal: controller.signal }));
      lastFetchRef.current = Date.now();
    } catch (issue) {
      // Os cards são informativos: se falharem, mantêm o último valor e a lista segue funcionando.
      // Cancelamento e sessão expirada (401/419, já tratada pelo logout automático) não são falhas.
      const ignored = issue.name === 'AbortError' || [401, 419].includes(issue.status);
      if (!ignored) console.error('Falha ao carregar o resumo dos chamados:', issue);
    }
  }, [mine]);

  useEffect(() => {
    refresh();
    return () => controllerRef.current?.abort();
  }, [refresh]);

  useOnRefocus(
    useCallback(() => {
      if (Date.now() - lastFetchRef.current >= STALE_AFTER_MS) refresh();
    }, [refresh]),
  );

  return { summary, refresh };
}
