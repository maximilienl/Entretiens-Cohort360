import type { RootState } from '@store/index';

/** Sélecteur : dictionnaire complet des médicaments indexé par ID. */
export const allMedications = (state: RootState) =>
  state.medicationsReducer.medications;

/** Sélecteur paramétré : retourne un médicament par son ID. */
export const medicationById = (id: number) => (state: RootState) =>
  state.medicationsReducer.medications[id];

export const medicationsCount = (state: RootState) =>
  state.medicationsReducer.count;

export const medicationsStatus = (state: RootState) =>
  state.medicationsReducer.status;
