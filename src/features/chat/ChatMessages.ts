import theme from '../../theme/theme';

export const outerBoxSx = {
  paddingRight: '5px',
};

export const messageRowSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: '0.5rem',
};

export const messageReverseSx = {
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'flex-start',
  marginBottom: '0.5rem',
};

export const contentStartSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

export const contentEndSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
};

export const avatarSx = {
  width: '40px',
  height: '40px',
  borderRadius: theme.customShape.roundedAvatar,
};

export const dateNameSx = {
  margin: '8px',
  fontSize: '14px',
};

export const textBoxOtherSx = {
  backgroundColor: theme.customColors.colorOtherMessage,
  display: 'inline-block',
  borderRadius: theme.customShape.roundedArea,
  padding: '12px 16px',
  margin: '8px',
  color: 'rgba(255, 255, 255, 0.87)',
  position: 'relative',
  '&:hover .message-actions': {
    opacity: 1,
  },
};

export const textBoxMeSx = {
  backgroundColor: theme.customColors.colorMyMessage,
  display: 'inline-block',
  borderRadius: theme.customShape.roundedArea,
  padding: '12px 16px',
  margin: '8px',
  color: theme.customColors.colorText,
  position: 'relative',
  '&:hover .message-actions': {
    opacity: 1,
  },
};

export const textSx = {
  fontSize: '14px',
};

export const messageActionsRightSx = {
  position: 'absolute',
  top: '50%',
  right: -40,
  transform: 'translateY(-50%)',
  opacity: 0,
  transition: 'opacity 0.1s ease-in-out',
};

export const messageActionsLeftSx = {
  position: 'absolute',
  top: '50%',
  left: -40,
  transform: 'translateY(-50%)',
  opacity: 0,
  transition: 'opacity 0.1s ease-in-out',
};

export const menuPaperMeSx = {
  backgroundColor: '#292641', // colours pakeisti i theme
  color: 'white',
};

export const menuPaperOtherSx = {
  backgroundColor: '#232036',
  color: 'white',
};
