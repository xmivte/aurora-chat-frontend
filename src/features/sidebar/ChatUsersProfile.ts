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
  right: '20px',
};
