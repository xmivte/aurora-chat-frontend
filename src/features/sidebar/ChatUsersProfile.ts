import { BadgeProps } from '@mui/material';

import theme from '../../theme/theme';

export const listItemStyles = {
  mb: 1,
};

export const onlineIndicatorPosition: BadgeProps['anchorOrigin'] = {
  vertical: 'bottom',
  horizontal: 'right',
};

export const onlineIndicatorForm = {
  width: 10,
  height: 10,
  borderRadius: theme.customShape.roundedAvatar,
};

export const unreadCountStyles = {
  ml: 1,
  minWidth: 22,
  height: 22,
  borderRadius: 999,
  px: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
};
