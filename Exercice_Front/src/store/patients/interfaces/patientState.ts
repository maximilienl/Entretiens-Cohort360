import type { PaginationParams } from '../../interfaces/pagination';

/** Représentation d'un patient tel que renvoyé par l'API. */
export interface PatientState {
  id: number;
  last_name: string;
  first_name: string;
  birth_date: string | null;
}

export interface PatientFilters extends PaginationParams {
  nom?: string;
  date_naissance?: string;
}

/** État Redux du domaine patients. */
export interface PatientsState {
  patients: Record<number, PatientState>;
  count: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
