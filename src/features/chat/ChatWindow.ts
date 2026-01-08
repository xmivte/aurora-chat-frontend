import theme from '../../theme/theme';

export const outerBoxSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.customShape.roundedArea,
  padding: '16px',
  boxShadow: `0px 4px 8px ${theme.customColors.colorMainShadow}`,
  overflow: 'hidden',
};

export const outerBoxFullSx = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
};

export const outerBoxOnlyChatSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

export const messagesSx = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.customColors.colorGray} ${theme.palette.primary.main}`,
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.primary.main,
    borderRadius: theme.customShape.roundedArea,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.customColors.colorGray,
    borderRadius: theme.customShape.roundedArea,
  },
};

export const inputSx = {
  flexShrink: 0,
  marginTop: '15px',
  backgroundColor: theme.customColors.colorMyMessage,
  borderRadius: theme.customShape.roundedContainer,
  width: '100%',
  boxShadow: `0px 4px 8px ${theme.customColors.colorMainShadow}`,
  '& .MuiInputBase-input': {
    color: theme.customColors.colorText,
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
};

export const sendButtonSx = {
  '&:focus': {
    border: 'none',
  },
};

export const isTypingSx = {
  padding: '8px 16px',
  fontStyle: 'italic',
  fontSize: '12px',
};
