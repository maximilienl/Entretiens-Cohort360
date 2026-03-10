import { createTheme } from '@mui/material/styles';

/** Thème MUI personnalisé aux couleurs AP-HP (bleu marine, fond gris clair). */
export const theme = createTheme({
  palette: {
    primary: { main: '#0C2340', light: '#1A3A5C', dark: '#06121F' },
    secondary: { main: '#E2001A' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
    background: { default: '#F4F6F8' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 6 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#0C2340' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
    MuiTableCell: {
      styleOverrides: { head: { fontWeight: 700, backgroundColor: '#F4F6F8' } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});
