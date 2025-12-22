import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import App from './App.tsx';
import { AuthRoute, LoginPage } from './auth';
import theme, { rootDivStyle } from './theme/theme.ts';
import WebSocketExample from './websockets/pages/WebSocketExample.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <div style={rootDivStyle(theme)}>
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
      </div>
    </ThemeProvider>
  </StrictMode>
);
