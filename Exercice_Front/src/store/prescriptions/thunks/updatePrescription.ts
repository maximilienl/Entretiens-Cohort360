import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoint } from '../../endpoint';
import type {
  PrescriptionState,
  PrescriptionPayload,
} from '../interfaces/prescriptionState';

interface UpdateArgs {
  id: number;
  data: Partial<PrescriptionPayload>;
}

/** Met à jour partiellement une prescription via PATCH et renvoie l'entité mise à jour. */
export const updatePrescription = createAsyncThunk<
  PrescriptionState,
  UpdateArgs
>('prescriptions/updatePrescription', async ({ id, data }) => {
  const url = endpoint(`Prescription/${id}`);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errors = await response.json();
    throw Error(JSON.stringify(errors));
  }

  return await response.json();
});
