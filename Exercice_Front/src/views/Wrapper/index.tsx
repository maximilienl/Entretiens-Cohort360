import { Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

/** Layout racine : AppBar AP-HP et Outlet pour les routes enfants. */
export const Wrapper: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 800, letterSpacing: 1, color: '#fff' }}
        >
          AP-HP
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
      <Outlet />
    </Container>
  </Box>
);
