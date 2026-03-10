/** Construit l'URL complète d'un endpoint API à partir d'un chemin relatif. */
export const endpoint = (url: string): string => {
  const { VITE_API_ENDPOINT } = import.meta.env;
  return `${VITE_API_ENDPOINT || 'http://localhost:8000'}/${url}`;
};
