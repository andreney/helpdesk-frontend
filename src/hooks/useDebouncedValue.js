import { useEffect, useState } from 'react';

/** Devolve `value` só depois que ele parar de mudar por `delay` ms (ex.: campo de busca). */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debounced;
}
