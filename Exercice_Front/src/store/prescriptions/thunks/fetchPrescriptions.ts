import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoint } from '../../endpoint';
import { buildQuery } from '../../utils/buildQuery';
import type { PrescriptionState, PrescriptionFilters } from '../interfaces/prescriptionState';
import type { PaginatedResponse } from '../../interfaces/pagination';

interface FetchPrescriptionsResult {
  count: number;
  results: PrescriptionState[];
}

/** Récupère une page de prescriptions selon les filtres fournis. */
export const fetchPrescriptions = createAsyncThunk<
  FetchPrescriptionsResult,
  PrescriptionFilters | void
>('prescriptions/fetchPrescriptions', async (filters) => {
  const url = endpoint(`Prescription${buildQuery(filters ?? undefined)}`);
  const response = await fetch(url);
  if (!response.ok) throw Error('Failed to fetch prescriptions');

  const data: PaginatedResponse<PrescriptionState> = await response.json();
  return { count: data.count, results: data.results };
});
