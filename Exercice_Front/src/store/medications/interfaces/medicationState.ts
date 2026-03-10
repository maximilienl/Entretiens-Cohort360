import type { PaginationParams } from '../../interfaces/pagination';

/** Représentation d'un médicament tel que renvoyé par l'API. */
export interface MedicationState {
  id: number;
  code: string;
  label: string;
  status: 'actif' | 'suppr';
}

export interface MedicationFilters extends PaginationParams {
  status?: 'actif' | 'suppr';
}

/** État Redux du domaine médicaments. */
export interface MedicationsState {
  medications: Record<number, MedicationState>;
  count: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
