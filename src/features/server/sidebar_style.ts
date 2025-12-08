import type { ThemeColors } from './sidebar_theme';

export const createSideBarSx = (colors: ThemeColors) => {
  const containerSx = {
    width: 72,
    height: '100vh',
    background: `linear-gradient(180deg, ${colors.gradientStart} 0%, ${
      colors.gradientMiddle ?? colors.gradientStart
    } 45%, ${colors.gradientEnd} 100%)`,
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const buttonSx = {
    p: 0,
    borderRadius: '14px',
    '&:hover .sb-avatar': { transform: 'scale(1.12)' },
    '&:focus': { outline: 'none' },
  };

  const avatarSx = (isActive: boolean, bg?: string) => ({
    bgcolor: bg ?? colors.avatarBg,
    width: 48,
    height: 48,
    borderRadius: '14px',
    fontWeight: 600,
    border: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
    boxSizing: 'border-box',
    transition: 'transform 150ms cubic-bezier(.2,.8,.2,1)',
    '& img': { width: 32, height: 32, objectFit: 'contain' },
  });

  const topStackSx = { p: 1, alignItems: 'center', flexShrink: 0 };
  const contentStackSx = {
    p: 1,
    alignItems: 'center',
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
    display: 'none',
  },
  };
  const footerStackSx = { p: 1, alignItems: 'center', flexShrink: 0 };

  const emptyStateTextSx = {
    color: colors.mutedText,
    fontSize: 12,
    textAlign: 'center',
    px: 1,
    py: 2,
  };

  const dividerSx = {
    width: '60%',
    bgcolor: colors.divider,
  };

  const addServerSectionStackSx = {
    p: 1,
    alignItems: 'center',
    flexShrink: 0,
  };

  const addServerAvatarSx = {
    ...avatarSx(false),
    color: colors.accent,
    fontSize: 24,
    fontWeight: 300,
  };

  return {
    containerSx,
    buttonSx,
    avatarSx,
    topStackSx,
    contentStackSx,
    footerStackSx,
    emptyStateTextSx,
    dividerSx,
    addServerSectionStackSx,
    addServerAvatarSx,
  };
};
