import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/index';

/** Sélecteur : dictionnaire complet des prescriptions indexé par ID. */
export const allPrescriptions = (state: RootState) =>
  state.prescriptionsReducer.prescriptions;

/** Sélecteur paramétré : retourne une prescription par son ID. */
export const prescriptionById = (id: number) => (state: RootState) =>
  state.prescriptionsReducer.prescriptions[id];

/** Nombre total de prescriptions (côté serveur, pas uniquement la page courante). */
export const prescriptionsCount = (state: RootState) =>
  state.prescriptionsReducer.count;

/** Statut du dernier appel async (idle | loading | succeeded | failed). */
export const prescriptionsStatus = (state: RootState) =>
  state.prescriptionsReducer.status;

/** Liste memoizée des prescriptions de la page courante. */
export const prescriptionsList = createSelector(
  [allPrescriptions],
  prescriptions => Object.values(prescriptions)
);
