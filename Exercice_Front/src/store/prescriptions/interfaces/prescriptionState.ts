import type { PatientState } from '../../patients/interfaces/patientState';
import type { MedicationState } from '../../medications/interfaces/medicationState';
import type { PaginationParams } from '../../interfaces/pagination';

/** Représentation d'une prescription telle que renvoyée par l'API (patient et médicament imbriqués). */
export interface PrescriptionState {
  id: number;
  patient: PatientState;
  medication: MedicationState;
  start_date: string;
  end_date: string;
  status: 'valide' | 'en_attente' | 'suppr';
  comment: string;
}

/** Payload envoyé à l'API pour créer ou modifier une prescription. */
export interface PrescriptionPayload {
  patient_id: number;
  medication_id: number;
  start_date: string;
  end_date: string;
  status: 'valide' | 'en_attente' | 'suppr';
  comment?: string;
}

/** Filtres applicables à la liste de prescriptions, délégués à l'API. */
export interface PrescriptionFilters extends PaginationParams {
  patient?: number;
  medication?: number;
  status?: 'valide' | 'en_attente' | 'suppr';
  start_date?: string;
  start_date_gte?: string;
  start_date_lte?: string;
  end_date?: string;
  end_date_gte?: string;
  end_date_lte?: string;
}

/** État Redux du domaine prescriptions. */
export interface PrescriptionsState {
  prescriptions: Record<number, PrescriptionState>;
  count: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
