import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';

/** Hook typé pour lire le state Redux avec inférence automatique de RootState. */
export const useAppSelector = useSelector.withTypes<RootState>();
