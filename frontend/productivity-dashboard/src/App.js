import React from 'react';
import TaskList from './components/TaskList';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a custom theme (optional)
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <TaskList />
      </Container>
    </ThemeProvider>
  );
}

export default App;