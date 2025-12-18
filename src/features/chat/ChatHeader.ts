import theme from '../../theme/theme';

export const outerBoxSx = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  gap: '12px',
};

export const avatarSx = {
  width: '48px',
  height: '48px',
  borderRadius: theme.customShape.roundedAvatar,
  objectFit: 'cover',
};

export const nameSx = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.customColors.colorText,
};

export const chatInfoBtnSx = {
  color: theme.customColors.colorPurple,
  outline: 'none',
  '&:focus': { outline: 'none' },
  '&:focus-visible': { outline: 'none' },
};
