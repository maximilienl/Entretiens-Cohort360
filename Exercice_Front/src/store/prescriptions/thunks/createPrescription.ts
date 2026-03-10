import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoint } from '../../endpoint';
import type {
  PrescriptionState,
  PrescriptionPayload,
} from '../interfaces/prescriptionState';

/** Crée une nouvelle prescription via POST et renvoie l'entité créée. */
export const createPrescription = createAsyncThunk<
  PrescriptionState,
  PrescriptionPayload
>('prescriptions/createPrescription', async (payload) => {
  const url = endpoint('Prescription');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errors = await response.json();
    throw Error(JSON.stringify(errors));
  }

  return await response.json();
});
