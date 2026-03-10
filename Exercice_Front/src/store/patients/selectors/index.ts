import type { RootState } from '@store/index';

/** Sélecteur : dictionnaire complet des patients indexé par ID. */
export const allPatients = (state: RootState) =>
  state.patientsReducer.patients;

/** Sélecteur paramétré : retourne un patient par son ID. */
export const patientById = (id: number) => (state: RootState) =>
  state.patientsReducer.patients[id];

export const patientsCount = (state: RootState) =>
  state.patientsReducer.count;

export const patientsStatus = (state: RootState) =>
  state.patientsReducer.status;
