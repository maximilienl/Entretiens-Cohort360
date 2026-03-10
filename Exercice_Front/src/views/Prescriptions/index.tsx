import { useEffect, useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { fetchPrescriptions } from '@store/prescriptions/thunks/fetchPrescriptions';
import {
  prescriptionsList,
  prescriptionsCount,
  prescriptionsStatus,
} from '@store/prescriptions/selectors';
import type { PrescriptionFilters } from '@store/prescriptions/interfaces/prescriptionState';
import { PrescriptionTable } from '@components/PrescriptionTable';
import { PrescriptionFiltersBar } from '@components/PrescriptionFilters';
import { PrescriptionForm } from '@components/PrescriptionForm';
import { Pagination } from '@components/Pagination';

const DEFAULT_ELEMENTS = 20;

const DEFAULT_FILTERS: PrescriptionFilters = {
  elements: DEFAULT_ELEMENTS,
  offset: 0,
};

/** Vue principale : liste paginée des prescriptions avec filtres, tri et formulaire de création/édition. */
export const Prescriptions: React.FC = () => {
  const dispatch = useAppDispatch();

  const prescriptions = useAppSelector(prescriptionsList);
  const count = useAppSelector(prescriptionsCount);
  const status = useAppSelector(prescriptionsStatus);

  const [filters, setFilters] = useState<PrescriptionFilters>(DEFAULT_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadPrescriptions = useCallback(() => {
    dispatch(fetchPrescriptions(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const handleFiltersChange = (newFilters: Partial<PrescriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const handleOrderingChange = (ordering: string | undefined) => {
    setFilters(prev => ({ ...prev, ordering, offset: 0 }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = useMemo(() =>
    Object.entries(filters).some(
      ([k, v]) => k !== 'elements' && k !== 'offset' && v !== undefined && v !== ''
    ),
  [filters]);

  const handlePageChange = (offset: number) => {
    setFilters(prev => ({ ...prev, offset }));
  };

  const handleElementsChange = (elements: number) => {
    setFilters(prev => ({ ...prev, elements, offset: 0 }));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadPrescriptions();
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" component="h2" fontWeight={700}>
          Gestion des prescriptions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Nouvelle prescription
        </Button>
      </Stack>

      <PrescriptionFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      <PrescriptionTable
        prescriptions={prescriptions}
        loading={status === 'loading'}
        ordering={filters.ordering}
        onEdit={handleEdit}
        onOrderingChange={handleOrderingChange}
      />

      <Pagination
        count={count}
        offset={filters.offset ?? 0}
        elements={filters.elements ?? DEFAULT_ELEMENTS}
        onPageChange={handlePageChange}
        onElementsChange={handleElementsChange}
      />

      {showForm && (
        <PrescriptionForm
          prescriptionId={editingId}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </Box>
  );
};
