import { useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ALL_STATUSES, PAGE_SIZE } from './constants';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Busca, filtro de status e página. O escopo ("meus chamados") vem de fora (navegação).
 * `params` é o que a API recebe; a busca só é enviada depois que o usuário para de digitar.
 */
export function useTicketFilters({ mine }) {
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  // A página pertence ao conjunto de filtros em que foi escolhida: mudou o filtro, volta à página 1.
  // Reiniciar durante a renderização (e não só comparar chaves) evita que uma página antiga
  // "ressuscite" quando o usuário volta a uma combinação de filtros anterior.
  const filtersKey = JSON.stringify([status, search, mine]);
  const [pageState, setPageState] = useState({ key: filtersKey, page: 1 });
  if (pageState.key !== filtersKey) setPageState({ key: filtersKey, page: 1 });

  const page = pageState.key === filtersKey ? pageState.page : 1;
  const setPage = (nextPage) => setPageState({ key: filtersKey, page: nextPage });

  return {
    searchInput,
    setSearchInput,
    status,
    setStatus,
    page,
    setPage,
    hasActiveFilters: status !== ALL_STATUSES || searchInput.trim() !== '',
    params: { page, perPage: PAGE_SIZE, status, search, mine },
  };
}
