export const chatListSx = {
  width: '100%',
  color: '#ffffff',
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
  backgroundColor: isSelected ? '#2a2a3f' : 'transparent',
  '&:hover': {
    backgroundColor: '#1a1a2b',
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
  backgroundColor: '#6a5acd',
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
  color: isUnread ? '#ffffff' : '#e0e0f0',
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
  color: '#f4f1ff',
  background: 'rgba(138, 92, 246, 0.28)',
  border: '1px solid rgba(138, 92, 246, 0.95)',
  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.22)',
};
