import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { AuthRoute, LoginPage } from './auth';
import theme from './theme/theme.ts';
import WebSocketExample from './websockets/pages/WebSocketExample.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <div style={{
        '--color-primary': theme.palette.primary.main,
        '--color-secondary': theme.palette.secondary.main,
        '--color-text': theme.customColors.colorText,
        '--color-blue-dark': theme.customColors.colorBlueDark,
        '--color-blue-light': theme.customColors.colorBlueLight,
        '--color-blue-light-hover': theme.customColors.colorBlueLightHover,
        '--color-purple': theme.customColors.colorPurple,
        '--color-purple-light': theme.customColors.colorPurpleLight,
        '--color-pink': theme.customColors.colorPink,
        '--color-pink-light': theme.customColors.colorPinkLight,
        '--color-main-shadow': theme.customColors.colorMainShadow,
        '--rounded-container': theme.customShape.roundedContainer,
        '--rounded-area': theme.customShape.roundedArea,
        '--rounded-btn': theme.customShape.roundedBtn,
        '--rounded-avatar': theme.customShape.roundedAvatar,
      } as React.CSSProperties}>
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
