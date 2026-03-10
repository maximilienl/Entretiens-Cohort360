import Chip from '@mui/material/Chip';
import type { PrescriptionState } from '@store/prescriptions/interfaces/prescriptionState';

const STATUS_CONFIG: Record<
  PrescriptionState['status'],
  { label: string; bg: string; color: string }
> = {
  valide: { label: 'Valide', bg: '#E8F5E9', color: '#1B5E20' },
  en_attente: { label: 'En attente', bg: '#FFF3E0', color: '#E65100' },
  suppr: { label: 'Supprimé', bg: '#FCE4EC', color: '#B71C1C' },
};

interface Props {
  status: PrescriptionState['status'];
}

/** Chip coloré en pastel affichant le statut d'une prescription. */
export const StatusChip: React.FC<Props> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
};
