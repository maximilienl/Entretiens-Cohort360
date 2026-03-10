import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useAsyncSearch } from '@hooks/useAsyncSearch';
import type { MedicationState } from '@store/medications/interfaces/medicationState';

interface Props {
  value?: number;
  onChange: (value: number | undefined) => void;
}

/** Autocomplete async de filtrage par médicament, recherche via l'API. */
export const MedicationSelect: React.FC<Props> = ({ value, onChange }) => {
  const { options, loading, inputValue, setInputValue } =
    useAsyncSearch<MedicationState>('Medication');

  const selected = options.find(m => m.id === value) ?? null;

  return (
    <Autocomplete<MedicationState, false>
      id="filter-medication"
      options={options}
      getOptionLabel={m => m.label}
      value={selected}
      onChange={(_, med) => onChange(med?.id)}
      inputValue={inputValue}
      onInputChange={(_, val, reason) => {
        if (reason !== 'reset') setInputValue(val);
      }}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label="Médicament"
          name="medication"
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
