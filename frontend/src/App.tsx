import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Toaster position="top-right" />
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Hospital Management System</h1>
            <p>Welcome to the Hospital Management System</p>
            <p style={{ marginTop: '20px', color: '#666' }}>
              Frontend is running successfully!
            </p>
            <p style={{ marginTop: '10px', color: '#666' }}>
              Backend API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}
            </p>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
