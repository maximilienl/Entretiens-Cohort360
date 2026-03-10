import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoint } from '../../endpoint';
import { fetchAllPages } from '../../utils/fetchAllPages';
import type { PatientState } from '../interfaces/patientState';

interface FetchPatientsResult {
  count: number;
  results: PatientState[];
}

/** Récupère la totalité des patients en parcourant toutes les pages de l'API. */
export const fetchPatients = createAsyncThunk<FetchPatientsResult, void>(
  'patients/fetchPatients',
  async () => {
    const url = endpoint('Patient');
    const results = await fetchAllPages<PatientState>(url);
    return { count: results.length, results };
  }
);
