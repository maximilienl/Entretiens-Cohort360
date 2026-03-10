import TextField from '@mui/material/TextField';

interface Props {
  startValue?: string;
  endValue?: string;
  onStartChange: (value: string | undefined) => void;
  onEndChange: (value: string | undefined) => void;
}

/** Paire de champs date pour filtrer par plage (début ≥ / fin ≤). */
export const DateRangeFields: React.FC<Props> = ({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}) => (
  <>
    <TextField
      id="filter-start-date"
      name="start_date_gte"
      label="Début à partir de"
      type="date"
      value={startValue ?? ''}
      onChange={e => onStartChange(e.target.value || undefined)}
      slotProps={{ inputLabel: { shrink: true } }}
      sx={{ minWidth: 160 }}
    />
    <TextField
      id="filter-end-date"
      name="end_date_lte"
      label="Fin jusqu'au"
      type="date"
      value={endValue ?? ''}
      onChange={e => onEndChange(e.target.value || undefined)}
      slotProps={{ inputLabel: { shrink: true } }}
      sx={{ minWidth: 160 }}
    />
  </>
);
