'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';

/**
 * Estado de listado en la URL (plan §8): búsqueda, página, orden y filtros
 * viven en los search params — `router.replace` sin scroll — para que el
 * atrás del navegador y los enlaces compartidos restauren la vista exacta.
 * Los valores por defecto no se escriben en la URL (queda limpia).
 */
export function useListUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const setPage = useCallback(
    (value: number) =>
      setParams({ page: value <= 1 ? undefined : String(value) }),
    [setParams],
  );

  return { searchParams, setParams, page, setPage };
}

/**
 * Input de búsqueda con debounce de 300ms sincronizado con el parámetro
 * `q`: el término aplicado vive en la URL (la query del listado lee de
 * ahí), cada búsqueda nueva resetea la página, y volver atrás restaura el
 * término en el input.
 */
export function useUrlSearchInput(
  setParams: (updates: Record<string, string | undefined>) => void,
  urlValue: string,
) {
  const [input, setInput] = useState(urlValue);
  const debounced = useDebouncedValue(input, 300);
  const lastApplied = useRef(urlValue);

  useEffect(() => {
    if (debounced !== lastApplied.current) {
      lastApplied.current = debounced;
      setParams({ q: debounced || undefined, page: undefined });
    }
  }, [debounced, setParams]);

  // Navegación atrás/adelante: la URL manda sobre el input. El ref evita
  // que este efecto pise lo que el usuario está tecleando cuando el cambio
  // de URL es el eco de nuestro propio debounce.
  useEffect(() => {
    if (urlValue !== lastApplied.current) {
      lastApplied.current = urlValue;
      setInput(urlValue);
    }
  }, [urlValue]);

  return { input, setInput };
}
