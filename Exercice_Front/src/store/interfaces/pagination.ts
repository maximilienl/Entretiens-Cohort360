/** Réponse paginée renvoyée par l'API Django REST Framework. */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Paramètres de pagination et tri communs à tous les endpoints list. */
export interface PaginationParams {
  offset?: number;
  elements?: number;
  search?: string;
  ordering?: string;
}
