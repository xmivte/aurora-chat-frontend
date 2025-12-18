import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import App from './App.tsx';
import { AuthRoute, LoginPage } from './auth';
import theme from './theme';
import WebSocketExample from './websockets/pages/WebSocketExample.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <AuthRoute>
                  <App />
                </AuthRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/websockets" element={<WebSocketExample />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
