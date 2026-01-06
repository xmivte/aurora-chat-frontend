import theme from '../../theme/theme';

import { PINNED_MESSAGES_WARNING } from './pinnedLimits';

export const outerBoxSx = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  gap: '12px',
};

export const headerBoxSx = {
  ...outerBoxSx,
  gap: 2,
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

export const pinButtonSx = {
  marginLeft: 'auto',
  color: theme.customColors.colorText,
  '&:hover': {
    backgroundColor: theme.customColors.colorBlueLightHover,
  },
};

export const pinIconSx = {
  width: 20,
  height: 20,
};

export const pinMenuPaperSx = {
  backgroundColor: theme.customColors.colorMyMessage,
  color: theme.customColors.colorText,
  width: 500,
  padding: 0,
  borderRadius: theme.customShape.roundedArea,
  maxHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export const getPinMenuPaperSx = (pinMenuMaxHeight: number | null) => ({
  ...pinMenuPaperSx,
  ...(pinMenuMaxHeight ? { maxHeight: `${pinMenuMaxHeight}px` } : {}),
});

export const pinMenuListRootSx = {
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
};

export const pinMenuHeaderSx = {
  borderBottom: `1px solid ${theme.customColors.colorGray}`,
  paddingBottom: '10px',
  fontSize: '20px',
  fontWeight: 600,
  paddingLeft: '10px',
  paddingTop: '10px',
  paddingRight: '10px',
  flexShrink: 0,
};

export const pinMenuFooterSx = {
  borderTop: `1px solid ${theme.customColors.colorGray}`,
  marginTop: 0,
  paddingTop: '10px',
  fontSize: '12px',
  color: theme.customColors.colorMutedText,
  textAlign: 'center',
  paddingBottom: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  flexShrink: 0,
};

export const getPinMenuFooterSx = (pinnedCount: number) => ({
  ...pinMenuFooterSx,
  ...(pinnedCount >= PINNED_MESSAGES_WARNING ? { color: theme.customColors.colorBusy } : {}),
});

export const pinMenuEmptySx = {
  padding: '30px',
  fontStyle: 'italic',
  textAlign: 'center',
  color: theme.customColors.colorMutedText,
};

export const pinMenuListSx = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  paddingTop: '15px',
  paddingBottom: '15px',
  paddingLeft: '10px',
  paddingRight: '10px',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.customColors.colorGray} ${theme.customColors.colorMyMessage}`,
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-track': {
    background: theme.customColors.colorMyMessage,
    borderRadius: theme.customShape.roundedArea,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.customColors.colorGray,
    borderRadius: theme.customShape.roundedArea,
  },
};

export const pinnedItemSx = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  padding: '12px 10px',
  borderRadius: theme.customShape.roundedArea,
  backgroundColor: theme.customColors.colorOtherMessage,
  '&:not(:last-of-type)': {
    marginBottom: '10px',
  },
};

export const pinnedAvatarSx = {
  width: 36,
  height: 36,
  borderRadius: theme.customShape.roundedAvatar,
  objectFit: 'cover',
  flexShrink: 0,
};

export const pinnedBodySx = {
  flex: 1,
  minWidth: 0,
};

export const pinnedMetaRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

export const pinnedNameSx = {
  fontSize: '14px',
  fontWeight: 600,
  color: theme.customColors.colorText,
};

export const pinnedTimeSx = {
  fontSize: '12px',
  color: theme.customColors.colorMutedText,
  whiteSpace: 'nowrap',
};

export const pinnedDiscardButtonSx = {
  marginLeft: 'auto',
  minWidth: 0,
  padding: '2px 8px',
  borderRadius: theme.customShape.roundedBtn,
  textTransform: 'none',
  fontSize: '12px',
  color: theme.customColors.colorPink,
  '&:hover': {
    backgroundColor: theme.customColors.colorBlueLightHover,
  },
};

export const pinnedContentSx = {
  marginTop: '6px',
  fontSize: '13px',
  color: theme.customColors.colorText,
  wordBreak: 'break-word',
};
