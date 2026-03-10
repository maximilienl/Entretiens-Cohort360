import { useState, useEffect, useCallback, useRef } from 'react';
import { endpoint } from '@store/endpoint';
import type { PaginatedResponse } from '@store/interfaces/pagination';

/**
 * Hook générique pour un Autocomplete async avec debounce.
 * Query l'API à chaque frappe et renvoie les résultats paginés.
 */
export const useAsyncSearch = <T>(resource: string, debounceMs = 300) => {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const fetchOptions = useCallback(
    async (search: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const res = await fetch(endpoint(`${resource}${query}`), {
          signal: controller.signal,
        });
        if (res.ok) {
          const data: PaginatedResponse<T> = await res.json();
          setOptions(data.results);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [resource]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchOptions(inputValue), debounceMs);
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, fetchOptions]);

  return { options, loading, inputValue, setInputValue };
};
