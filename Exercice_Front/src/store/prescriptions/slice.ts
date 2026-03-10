import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  PrescriptionsState,
  PrescriptionState,
} from './interfaces/prescriptionState';
import { fetchPrescriptions } from './thunks/fetchPrescriptions';
import { createPrescription } from './thunks/createPrescription';
import { updatePrescription } from './thunks/updatePrescription';

const initialState: PrescriptionsState = {
  prescriptions: {},
  count: 0,
  status: 'idle',
};

/** Slice Redux gérant les prescriptions. Reset complet à chaque fetch (pagination serveur). */
const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPrescriptions.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchPrescriptions.fulfilled,
        (
          state,
          action: PayloadAction<{
            count: number;
            results: PrescriptionState[];
          }>
        ) => {
          state.status = 'succeeded';
          state.count = action.payload.count;
          state.prescriptions = {};
          for (const prescription of action.payload.results) {
            state.prescriptions[prescription.id] = prescription;
          }
        }
      )
      .addCase(fetchPrescriptions.rejected, state => {
        state.status = 'failed';
      })
      .addCase(createPrescription.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        createPrescription.fulfilled,
        (state, action: PayloadAction<PrescriptionState>) => {
          state.status = 'succeeded';
          state.prescriptions[action.payload.id] = action.payload;
          state.count += 1;
        }
      )
      .addCase(createPrescription.rejected, state => {
        state.status = 'failed';
      })
      .addCase(updatePrescription.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        updatePrescription.fulfilled,
        (state, action: PayloadAction<PrescriptionState>) => {
          state.status = 'succeeded';
          state.prescriptions[action.payload.id] = action.payload;
        }
      )
      .addCase(updatePrescription.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default prescriptionsSlice.reducer;
