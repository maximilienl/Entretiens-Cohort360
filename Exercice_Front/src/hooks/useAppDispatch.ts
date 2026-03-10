import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/index';

/** Hook typé pour dispatcher des actions Redux. */
export const useAppDispatch = () => useDispatch<AppDispatch>();
