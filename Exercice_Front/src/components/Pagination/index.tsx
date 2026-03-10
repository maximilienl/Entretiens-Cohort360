import TablePagination from '@mui/material/TablePagination';

const ELEMENTS_PRESETS = [20, 50, 100, 200];

interface Props {
  count: number;
  offset: number;
  elements: number;
  onPageChange: (offset: number) => void;
  onElementsChange: (elements: number) => void;
}

/** Composant de pagination basé sur offset/elements, synchronisé avec l'API. */
export const Pagination: React.FC<Props> = ({
  count,
  offset,
  elements,
  onPageChange,
  onElementsChange,
}) => {
  if (count === 0) return null;

  const page = Math.floor(offset / elements);

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={elements}
      rowsPerPageOptions={ELEMENTS_PRESETS}
      onPageChange={(_, newPage) => onPageChange(newPage * elements)}
      onRowsPerPageChange={e => onElementsChange(Number(e.target.value))}
      labelRowsPerPage="Éléments par page :"
      labelDisplayedRows={({ from, to, count: total }) =>
        `${from}–${to} sur ${total}`
      }
      slotProps={{
        select: {
          id: 'pagination-rows-per-page',
          name: 'rows-per-page',
          'aria-label': 'Éléments par page',
        },
      }}
      sx={{ mt: 1 }}
    />
  );
};
