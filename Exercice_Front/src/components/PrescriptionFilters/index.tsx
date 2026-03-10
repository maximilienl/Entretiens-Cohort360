import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { PatientSelect } from './PatientSelect';
import { MedicationSelect } from './MedicationSelect';
import { StatusSelect } from './StatusSelect';
import { DateRangeFields } from './DateRangeFields';
import type { PrescriptionFilters } from '@store/prescriptions/interfaces/prescriptionState';

interface Props {
  filters: PrescriptionFilters;
  onChange: (filters: Partial<PrescriptionFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

/** Barre de filtres : recherche textuelle, patient, médicament, statut, plage de dates, et reset. */
export const PrescriptionFiltersBar: React.FC<Props> = ({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
}) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
      <TextField
        id="filter-search"
        name="search"
        placeholder="Rechercher…"
        aria-label="Rechercher"
        value={filters.search ?? ''}
        onChange={e => onChange({ search: e.target.value || undefined })}
        slotProps={{
          input: {
            'aria-label': 'Rechercher',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            'aria-label': 'Rechercher',
          },
        }}
        sx={{ minWidth: 220 }}
      />

      <PatientSelect
        value={filters.patient}
        onChange={patient => onChange({ patient })}
      />

      <MedicationSelect
        value={filters.medication}
        onChange={medication => onChange({ medication })}
      />

      <StatusSelect
        value={filters.status}
        onChange={status => onChange({ status })}
      />

      <DateRangeFields
        startValue={filters.start_date_gte}
        endValue={filters.end_date_lte}
        onStartChange={start_date_gte => onChange({ start_date_gte })}
        onEndChange={end_date_lte => onChange({ end_date_lte })}
      />

      {hasActiveFilters && (
        <Tooltip title="Réinitialiser les filtres">
          <IconButton onClick={onReset} size="small" color="primary">
            <FilterListOffIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  </Paper>
);
