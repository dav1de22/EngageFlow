import React from 'react';
import TaskList from './components/TaskList';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  IconButton,
  Box,
  useMediaQuery
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function App() {
  // Check user's system preference for dark mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // State for theme mode
  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');

  // Create theme based on mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#2196F3',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#fff',
                },
                taskHeader: {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                }
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#90caf9',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                taskHeader: {
                  background: 'linear-gradient(45deg, #1e88e5 30%, #1976d2 90%)',
                }
              }),
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          position: 'fixed', 
          top: 16, 
          right: 16,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderRadius: '50%',
        }}
      >
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>
      <Container>
        <TaskList />
      </Container>
    </ThemeProvider>
  );
}

export default App;