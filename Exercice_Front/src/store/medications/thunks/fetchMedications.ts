import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoint } from '../../endpoint';
import { fetchAllPages } from '../../utils/fetchAllPages';
import type { MedicationState } from '../interfaces/medicationState';

interface FetchMedicationsResult {
  count: number;
  results: MedicationState[];
}

/** Récupère la totalité des médicaments en parcourant toutes les pages de l'API. */
export const fetchMedications = createAsyncThunk<FetchMedicationsResult, void>(
  'medications/fetchMedications',
  async () => {
    const url = endpoint('Medication');
    const results = await fetchAllPages<MedicationState>(url);
    return { count: results.length, results };
  }
);
