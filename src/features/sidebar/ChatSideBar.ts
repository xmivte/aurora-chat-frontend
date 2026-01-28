import theme from '../../theme/theme';

export const paperStyles = {
  backgroundColor: theme.palette.secondary.main,
  padding: '2px',
  width: '300px',
  color: theme.customColors.colorText,
  marginLeft: '15px',
  borderRadius: theme.customShape.roundedContainer,
  border: '5px solid',
  borderColor: theme.palette.primary.main,
};

export const listTextStyles = {
  padding: '20px',
};

export const closeButtonStyles = {
  color: theme.customColors.colorText,
  float: 'right',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
};
