import { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useAsyncSearch } from '@hooks/useAsyncSearch';
import type { PatientState } from '@store/patients/interfaces/patientState';
import type { MedicationState } from '@store/medications/interfaces/medicationState';
import type { PrescriptionPayload } from '@store/prescriptions/interfaces/prescriptionState';

interface Props {
  form: PrescriptionPayload;
  errors: Record<string, string>;
  updateField: <K extends keyof PrescriptionPayload>(
    field: K,
    value: PrescriptionPayload[K]
  ) => void;
  initialPatient?: PatientState;
  initialMedication?: MedicationState;
}

/** Champs du formulaire prescription : sélection patient/médicament (async), dates, statut, commentaire. */
export const FormFields: React.FC<Props> = ({
  form,
  errors,
  updateField,
  initialPatient,
  initialMedication,
}) => {
  const patientSearch = useAsyncSearch<PatientState>('Patient');
  const medicationSearch = useAsyncSearch<MedicationState>('Medication');

  const [selectedPatient, setSelectedPatient] = useState<PatientState | null>(
    initialPatient ?? null
  );
  const [selectedMedication, setSelectedMedication] =
    useState<MedicationState | null>(initialMedication ?? null);

  return (
    <Stack spacing={2.5}>
      <Autocomplete<PatientState, false>
        id="form-patient"
        options={patientSearch.options}
        getOptionLabel={p => `${p.last_name} ${p.first_name}`}
        value={selectedPatient}
        onChange={(_, patient) => {
          setSelectedPatient(patient);
          updateField('patient_id', patient?.id ?? 0);
        }}
        inputValue={patientSearch.inputValue}
        onInputChange={(_, val, reason) => {
          if (reason !== 'reset') patientSearch.setInputValue(val);
        }}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        loading={patientSearch.loading}
        renderInput={params => (
          <TextField
            {...params}
            label="Patient *"
            name="patient_id"
            error={!!errors.patient_id}
            helperText={errors.patient_id}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {patientSearch.loading && <CircularProgress size={18} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Autocomplete<MedicationState, false>
        id="form-medication"
        options={medicationSearch.options}
        getOptionLabel={m => `${m.label} (${m.code})`}
        value={selectedMedication}
        onChange={(_, med) => {
          setSelectedMedication(med);
          updateField('medication_id', med?.id ?? 0);
        }}
        inputValue={medicationSearch.inputValue}
        onInputChange={(_, val, reason) => {
          if (reason !== 'reset') medicationSearch.setInputValue(val);
        }}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        loading={medicationSearch.loading}
        renderInput={params => (
          <TextField
            {...params}
            label="Médicament *"
            name="medication_id"
            error={!!errors.medication_id}
            helperText={errors.medication_id}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {medicationSearch.loading && (
                      <CircularProgress size={18} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          id="form-start-date"
          name="start_date"
          label="Date de début *"
          type="date"
          fullWidth
          value={form.start_date}
          onChange={e => updateField('start_date', e.target.value)}
          error={!!errors.start_date}
          helperText={errors.start_date}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          id="form-end-date"
          name="end_date"
          label="Date de fin *"
          type="date"
          fullWidth
          value={form.end_date}
          onChange={e => updateField('end_date', e.target.value)}
          error={!!errors.end_date}
          helperText={errors.end_date}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <FormControl fullWidth>
        <InputLabel id="form-status-label">Statut *</InputLabel>
        <Select
          labelId="form-status-label"
          id="form-status"
          name="status"
          label="Statut *"
          value={form.status}
          onChange={(e: SelectChangeEvent<string>) =>
            updateField(
              'status',
              e.target.value as PrescriptionPayload['status']
            )
          }
        >
          <MenuItem value="en_attente">En attente</MenuItem>
          <MenuItem value="valide">Valide</MenuItem>
          <MenuItem value="suppr">Supprimé</MenuItem>
        </Select>
      </FormControl>

      <TextField
        id="form-comment"
        name="comment"
        label="Commentaire"
        multiline
        rows={3}
        fullWidth
        value={form.comment ?? ''}
        onChange={e => updateField('comment', e.target.value)}
      />
    </Stack>
  );
};
