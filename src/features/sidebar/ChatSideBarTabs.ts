import theme from '../../theme/theme';

export const tabStyles = {
  flexGrow: 1,
  textTransform: 'none',
  minHeight: 0,
  bgcolor: theme.customColors.colorBlueDark,
  borderRadius: theme.customShape.roundedContainer,
  border: '0px',
  color: theme.customColors.colorText,
  outline: 'none !important',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
  '&:hover': {
    bgcolor: theme.customColors.colorBlueLightHover,
    cursor: 'pointer',
  },
};

export const activeTabStyles = {
  color: theme.customColors.colorText,
  bgcolor: theme.customColors.colorBlueLight,
  outline: 'none',
  boxShadow: 'none',
};

export const boxStyles = {
  width: '100%',
  bgcolor: theme.palette.secondary.main,
};
