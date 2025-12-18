import { SxProps, Theme } from '@mui/material';

import theme from '../../theme/theme';

export const title: SxProps<Theme> = {
  fontSize: '2.5rem',
  letterSpacing: '4px',
  fontWeight: 600,
  color: theme.customColors.colorText,
};

export const paper: SxProps<Theme> = {
  bgcolor: theme.palette.primary.main,
  p: '40px 35px',
  borderRadius: theme.customShape.roundedContainer,
  width: '310px',
};

export const alert: SxProps<Theme> = {
  mt: 1,
};

export const providerSignInButton: SxProps<Theme> = {
  p: '14px 0',
  borderRadius: theme.customShape.roundedBtn,
  background: `linear-gradient(90deg, ${theme.customColors.colorPurple}, ${theme.customColors.colorPink})`,
  lineHeight: 1.4,
  fontSize: '16px',
  color: theme.customColors.colorText,
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.customColors.colorPurpleLight}, ${theme.customColors.colorPinkLight})`,
  },
};

export const logoutButton: SxProps<Theme> = {
  p: '10px 0',
  borderRadius: theme.customShape.roundedBtn,
  background: theme.customColors.btnLogout,
  lineHeight: 1.4,
  fontSize: '16px',
  color: theme.customColors.colorText,
  width: '100px',
  '&:hover': {
    background: theme.palette.primary.main,
  },
};

export const backgroundContainer: SxProps<Theme> = {
  background: `linear-gradient(135deg, ${theme.customColors.colorGradientStart}, ${theme.customColors.colorGradientMiddle})`,
  display: 'flex',
  placeItems: 'center',
  justifyContent: 'center',
  minWidth: '100vw',
  minHeight: '100vh',
  margin: 0,
  textAlign: 'center',
};
