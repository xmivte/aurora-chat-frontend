import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { getAuth } from 'firebase/auth';
import { StrictMode, useState, createContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import App from './App.tsx';
import { AuthRoute, LoginPage } from './auth';
import { BACKEND_URL } from './config/env.ts';
import SettingsPage from './features/settings/SettingsPage.tsx';
import { type UserDataDto } from './features/settings/types';
import theme, { rootDivStyle } from './theme/theme.ts';

const defaultContext: UserDataDto = {
  username: 'guest',
  image: 'none',
};

type UserContextType = {
  user: UserDataDto;
  setUser: React.Dispatch<React.SetStateAction<UserDataDto>>;
};

export const UserCxt = createContext<UserContextType | null>(null);

const queryClient = new QueryClient();

export const axiosApi = axios.create({
  baseURL: BACKEND_URL,
});

const auth = getAuth();

const Main = () => {
  const [userContext, setUserContext] = useState(defaultContext);

  useEffect(() => {
    const interceptor = axiosApi.interceptors.request.use(
      async config => {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    return () => axiosApi.interceptors.request.eject(interceptor);
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <UserCxt.Provider value={{ user: userContext, setUser: setUserContext }}>
            <div style={rootDivStyle(theme)}>
              <Router>
                <AuthRoute>
                  <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </AuthRoute>
              </Router>
            </div>
          </UserCxt.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Main />);
