import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useAsyncSearch } from '@hooks/useAsyncSearch';
import type { PatientState } from '@store/patients/interfaces/patientState';

interface Props {
  value?: number;
  onChange: (value: number | undefined) => void;
}

/** Autocomplete async de filtrage par patient, recherche via l'API. */
export const PatientSelect: React.FC<Props> = ({ value, onChange }) => {
  const { options, loading, inputValue, setInputValue } =
    useAsyncSearch<PatientState>('Patient');

  const selected = options.find(p => p.id === value) ?? null;

  return (
    <Autocomplete<PatientState, false>
      id="filter-patient"
      options={options}
      getOptionLabel={p => `${p.last_name} ${p.first_name}`}
      value={selected}
      onChange={(_, patient) => onChange(patient?.id)}
      inputValue={inputValue}
      onInputChange={(_, val, reason) => {
        if (reason !== 'reset') setInputValue(val);
      }}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label="Patient"
          name="patient"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={18} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      size="small"
      sx={{ minWidth: 220 }}
    />
  );
};
