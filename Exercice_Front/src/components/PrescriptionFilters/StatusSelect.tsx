import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { PrescriptionFilters } from '@store/prescriptions/interfaces/prescriptionState';

interface Props {
  value?: PrescriptionFilters['status'];
  onChange: (value: PrescriptionFilters['status'] | undefined) => void;
}

const OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'valide', label: 'Valide' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'suppr', label: 'Supprimé' },
] as const;

/** Select de filtrage par statut de prescription (valide, en attente, supprimé). */
export const StatusSelect: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(
      (e.target.value || undefined) as PrescriptionFilters['status'] | undefined
    );
  };

  return (
    <FormControl sx={{ minWidth: 150 }} size="small">
      <InputLabel id="filter-status-label">Statut</InputLabel>
      <Select
        labelId="filter-status-label"
        id="filter-status"
        name="status"
        label="Statut"
        value={value ?? ''}
        onChange={handleChange}
        inputProps={{ id: 'filter-status-native', 'aria-label': 'Statut' }}
      >
        {OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
