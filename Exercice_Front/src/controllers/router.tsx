import { Routes, Route, Navigate } from 'react-router-dom';
import { Wrapper } from '@views/Wrapper';
import { Prescriptions } from '@views/Prescriptions';

/** Définition des routes. Toutes les pages sont enfants du Wrapper (layout commun). */
export const Router: React.FC = () => (
  <Routes>
    <Route element={<Wrapper />}>
      <Route path="/" element={<Navigate to="/prescriptions" replace />} />
      <Route path="/prescriptions" element={<Prescriptions />} />
    </Route>
  </Routes>
);
