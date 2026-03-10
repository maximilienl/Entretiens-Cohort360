import type { PaginatedResponse } from '../interfaces/pagination';

/** Parcourt toutes les pages d'un endpoint paginé DRF en suivant le champ `next`. */
export const fetchAllPages = async <T>(baseUrl: string): Promise<T[]> => {
  const results: T[] = [];
  let url: string | null = baseUrl;

  while (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const data: PaginatedResponse<T> = await response.json();
    results.push(...data.results);
    url = data.next;
  }

  return results;
};
