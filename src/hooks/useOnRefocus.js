import { useEffect, useRef } from 'react';

/**
 * Chama `handler` quando o usuário volta para a aba ou para a janela.
 * Quem usa decide se vale a pena fazer algo (ex.: só se os dados estiverem velhos).
 */
export function useOnRefocus(handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    function onRefocus() {
      if (document.visibilityState === 'visible') handlerRef.current();
    }

    document.addEventListener('visibilitychange', onRefocus);
    window.addEventListener('focus', onRefocus);
    return () => {
      document.removeEventListener('visibilitychange', onRefocus);
      window.removeEventListener('focus', onRefocus);
    };
  }, []);
}
