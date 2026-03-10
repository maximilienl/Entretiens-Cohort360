import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  MedicationsState,
  MedicationState,
} from './interfaces/medicationState';
import { fetchMedications } from './thunks/fetchMedications';

const initialState: MedicationsState = {
  medications: {},
  count: 0,
  status: 'idle',
};

/** Slice Redux gérant le référentiel médicaments (stockage normalisé par ID). */
const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    upsertMedications(state, action: PayloadAction<MedicationState[]>) {
      for (const medication of action.payload) {
        state.medications[medication.id] = medication;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMedications.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchMedications.fulfilled,
        (
          state,
          action: PayloadAction<{
            count: number;
            results: MedicationState[];
          }>
        ) => {
          state.status = 'succeeded';
          state.count = action.payload.count;
          for (const medication of action.payload.results) {
            state.medications[medication.id] = medication;
          }
        }
      )
      .addCase(fetchMedications.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const { upsertMedications } = medicationsSlice.actions;
export default medicationsSlice.reducer;
