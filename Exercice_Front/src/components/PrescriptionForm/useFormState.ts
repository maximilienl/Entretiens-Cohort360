import { useState, useEffect } from 'react';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { prescriptionById } from '@store/prescriptions/selectors';
import { createPrescription } from '@store/prescriptions/thunks/createPrescription';
import { updatePrescription } from '@store/prescriptions/thunks/updatePrescription';
import type { PrescriptionPayload } from '@store/prescriptions/interfaces/prescriptionState';

const EMPTY_FORM: PrescriptionPayload = {
  patient_id: 0,
  medication_id: 0,
  start_date: '',
  end_date: '',
  status: 'en_attente',
  comment: '',
};

/** Hook gérant l'état du formulaire prescription : validation client, soumission, et remontée des erreurs API. */
export const useFormState = (
  prescriptionId: number | null,
  onSuccess: () => void
) => {
  const dispatch = useAppDispatch();
  const existing = useAppSelector(
    prescriptionId ? prescriptionById(prescriptionId) : () => undefined
  );

  const [form, setForm] = useState<PrescriptionPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = prescriptionId !== null;

  useEffect(() => {
    if (existing) {
      setForm({
        patient_id: existing.patient.id,
        medication_id: existing.medication.id,
        start_date: existing.start_date,
        end_date: existing.end_date,
        status: existing.status,
        comment: existing.comment,
      });
    }
  }, [existing]);

  const updateField = <K extends keyof PrescriptionPayload>(
    field: K,
    value: PrescriptionPayload[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.patient_id) errs.patient_id = 'Patient requis';
    if (!form.medication_id) errs.medication_id = 'Médicament requis';
    if (!form.start_date) errs.start_date = 'Date de début requise';
    if (!form.end_date) errs.end_date = 'Date de fin requise';
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      errs.end_date = 'La date de fin doit être ≥ date de début';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await dispatch(
          updatePrescription({ id: prescriptionId, data: form })
        ).unwrap();
      } else {
        await dispatch(createPrescription(form)).unwrap();
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      try {
        const parsed = JSON.parse(message);
        setErrors(
          Object.fromEntries(
            Object.entries(parsed).map(([k, v]) => [
              k,
              Array.isArray(v) ? v.join(', ') : String(v),
            ])
          )
        );
      } catch {
        setErrors({ _global: message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return { form, errors, submitting, isEditing, existing, updateField, handleSubmit };
};
