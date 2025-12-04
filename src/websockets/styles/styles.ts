import { SxProps, Theme } from '@mui/material';

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

export const containerBox: SxProps<Theme> = {
  p: 2.5,
};

export const sendMessageButton: SxProps<Theme> = {
  p: '14px 0',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #5832a2, #d84380)',
  lineHeight: 1.4,
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 0.87)',
};

export const messagesBox: SxProps<Theme> = {
  mt: 2.5,
};

export const messagesPaper: SxProps<Theme> = {
  height: 200,
  overflowY: 'auto',
  bgcolor: '#000000',
};

export const messageText: SxProps<Theme> = {
  mb: 0.4,
  fontSize: '12px',
  color: '#ffffff',
};
