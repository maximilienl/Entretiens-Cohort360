import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { useFormState } from './useFormState';
import { FormFields } from './FormFields';

interface Props {
  prescriptionId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

/** Dialog de création / édition d'une prescription. */
export const PrescriptionForm: React.FC<Props> = ({
  prescriptionId,
  onClose,
  onSuccess,
}) => {
  const { form, errors, submitting, isEditing, existing, updateField, handleSubmit } =
    useFormState(prescriptionId, onSuccess);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Modifier la prescription' : 'Nouvelle prescription'}
      </DialogTitle>
      <DialogContent dividers>
        {errors._global && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors._global}
          </Alert>
        )}
        <FormFields
          form={form}
          errors={errors}
          updateField={updateField}
          initialPatient={existing?.patient}
          initialMedication={existing?.medication}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button
          variant="contained"
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
