import theme from "../../theme/theme";

export const createSideBarSx = () => {
  const containerSx = {
    width: 72,
    height: '100vh',
    background: `linear-gradient(180deg, ${theme.customColors.colorGradientStart} 0%, ${
      theme.customColors.colorGradientMiddle ?? theme.customColors.colorGradientStart
    } 45%, ${theme.customColors.colorGradientEnd} 100%)`,
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const buttonSx = {
    p: 0,
    '&:hover .sb-avatar': { transform: 'scale(1.12)' },
    '&:focus': { outline: 'none' },
  };

  const avatarSx = (isActive: boolean, bg?: string) => ({
    bgcolor: bg ?? theme.palette.secondary.main,
    width: 48,
    height: 48,
    borderRadius: theme.customShape.roundedArea,
    fontWeight: 600,
    border: isActive ? `2px solid ${theme.customColors.colorPink}` : '2px solid transparent',
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
    color: theme.customColors.colorMutedText,
    fontSize: 12,
    textAlign: 'center',
    px: 1,
    py: 2,
  };

  const dividerSx = {
    width: '60%',
    bgcolor: theme.customColors.colorGray,
  };

  const addServerSectionStackSx = {
    p: 1,
    alignItems: 'center',
    flexShrink: 0,
  };

  const addServerAvatarSx = {
    ...avatarSx(false),
    color: theme.customColors.colorPink,
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
