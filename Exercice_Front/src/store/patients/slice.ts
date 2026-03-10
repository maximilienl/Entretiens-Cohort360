import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PatientsState, PatientState } from './interfaces/patientState';
import { fetchPatients } from './thunks/fetchPatients';

const initialState: PatientsState = {
  patients: {},
  count: 0,
  status: 'idle',
};

/** Slice Redux gérant le référentiel patients (stockage normalisé par ID). */
const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    upsertPatients(state, action: PayloadAction<PatientState[]>) {
      for (const patient of action.payload) {
        state.patients[patient.id] = patient;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPatients.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchPatients.fulfilled,
        (
          state,
          action: PayloadAction<{ count: number; results: PatientState[] }>
        ) => {
          state.status = 'succeeded';
          state.count = action.payload.count;
          for (const patient of action.payload.results) {
            state.patients[patient.id] = patient;
          }
        }
      )
      .addCase(fetchPatients.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const { upsertPatients } = patientsSlice.actions;
export default patientsSlice.reducer;
