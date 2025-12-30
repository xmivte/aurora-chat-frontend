import theme from '@/theme/theme';

export const chatListSx = {
  width: '100%',
  color: theme.customColors.colorText,
};

export const ulSx = {
  listStyle: 'none',
  p: 0,
  m: 0,
};

export const chatItemSx = (isSelected: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  p: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  backgroundColor: isSelected ? theme.customColors.colorBlueLight : 'transparent',
  '&:hover': {
    backgroundColor: theme.customColors.colorBlueLightHover,
  },
});

export const chatButtonSx = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  p: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
};

export const avatarSx = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: theme.customColors.colorPurpleLight,
  mr: '12px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
};

export const nameRowSx = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const chatNameSx = (isUnread: boolean) => ({
  fontSize: '16px',
  fontWeight: isUnread ? 'bold' : 'normal',
  color: isUnread ? theme.customColors.colorText : theme.customColors.colorMutedText,
});

export const unreadCountSx = {
  ml: 'auto',
  minWidth: '22px',
  height: '22px',
  px: '7px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 800,
  lineHeight: 1,
  color: theme.customColors.colorText,
  background: 'rgba(138, 92, 246, 0.28)',
  border: `1px solid ${theme.customColors.colorPurpleLight}`,
  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.22)',
};
