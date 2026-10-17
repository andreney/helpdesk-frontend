const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** URL base da API, sem barra final. Configurável via `VITE_API_BASE_URL`. */
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
