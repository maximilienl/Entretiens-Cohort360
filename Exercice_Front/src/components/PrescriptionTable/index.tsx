import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import { StatusChip } from './StatusChip';
import type { PrescriptionState } from '@store/prescriptions/interfaces/prescriptionState';

type SortableField = 'start_date' | 'end_date' | 'status';

interface Props {
  prescriptions: PrescriptionState[];
  loading: boolean;
  ordering?: string;
  onEdit: (id: number) => void;
  onOrderingChange: (ordering: string | undefined) => void;
}

const SORTABLE_COLUMNS: { field: SortableField; label: string }[] = [
  { field: 'start_date', label: 'Début' },
  { field: 'end_date', label: 'Fin' },
  { field: 'status', label: 'Statut' },
];

/** Parse une chaîne d'ordering API (`"-field"` → desc, `"field"` → asc). */
const parseOrdering = (ordering?: string): { field: string; direction: 'asc' | 'desc' } | null => {
  if (!ordering) return null;
  const desc = ordering.startsWith('-');
  return { field: desc ? ordering.slice(1) : ordering, direction: desc ? 'desc' : 'asc' };
};

/** Tableau des prescriptions avec colonnes triables (début, fin, statut) via l'API. */
export const PrescriptionTable: React.FC<Props> = ({
  prescriptions,
  loading,
  ordering,
  onEdit,
  onOrderingChange,
}) => {
  const current = parseOrdering(ordering);

  const handleSort = (field: SortableField) => {
    if (current?.field === field) {
      if (current.direction === 'asc') {
        onOrderingChange(`-${field}`);
      } else {
        onOrderingChange(undefined);
      }
    } else {
      onOrderingChange(field);
    }
  };

  if (loading && prescriptions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aucune prescription trouvée.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Médicament</TableCell>
            {SORTABLE_COLUMNS.map(col => (
              <TableCell key={col.field}>
                <TableSortLabel
                  active={current?.field === col.field}
                  direction={current?.field === col.field ? current.direction : 'asc'}
                  onClick={() => handleSort(col.field)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Commentaire</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prescriptions.map(p => (
            <TableRow key={p.id} hover>
              <TableCell>
                {p.patient.last_name} {p.patient.first_name}
              </TableCell>
              <TableCell>{p.medication.label}</TableCell>
              <TableCell>{p.start_date}</TableCell>
              <TableCell>{p.end_date}</TableCell>
              <TableCell>
                <StatusChip status={p.status} />
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 250,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.comment || '—'}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Modifier">
                  <IconButton size="small" onClick={() => onEdit(p.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
