import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/services/httpClient';
import * as categoriesApi from './categoriesApi';

/** Carrega as categorias ativas uma vez, cancelando a requisição se o componente desmontar. */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    categoriesApi
      .list({ signal: controller.signal })
      .then(setCategories)
      .catch((issue) => {
        if (issue.name !== 'AbortError') setError(getErrorMessage(issue));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
