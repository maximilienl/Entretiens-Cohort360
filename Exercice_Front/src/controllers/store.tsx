import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store, persistor } from '@store/index';
import { theme } from '../theme';
import { Router } from './router';
import { BrowserRouter } from 'react-router-dom';

/** Composant racine assemblant les providers (Redux, Persist, Theme, Router). */
export const Store: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
