import { SxProps, Theme } from '@mui/material';

export const title: SxProps<Theme> = {
  fontSize: '2.5rem',
  letterSpacing: '4px',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.87)',
};

export const paper: SxProps<Theme> = {
  bgcolor: '#141025',
  p: '40px 35px',
  borderRadius: '20px',
  width: '310px',
};

export const alert: SxProps<Theme> = {
  mt: 1,
};

export const providerSignInButton: SxProps<Theme> = {
  p: '14px 0',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #5832a2, #d84380)',
  lineHeight: 1.4,
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 0.87)',
};

export const logoutButton: SxProps<Theme> = {
  p: '10px 0',
  borderRadius: '12px',
  background: '#121222',
  lineHeight: 1.4,
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 0.87)',
  width: '100px',
  '&:hover': {
    background: '#2E2A4F',          
  },
};

export const backgroundContainer: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #1a133b, #451e42)',
  display: 'flex',
  placeItems: 'center',
  justifyContent: 'center',
  minWidth: '100vw',
  minHeight: '100vh',
  margin: 0,
  textAlign: 'center',
};
