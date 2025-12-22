import { createTheme, Theme } from '@mui/material/styles';
import './type';

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: { main: '#121222' }, // page color
    secondary: { main: '#1A192D' }, // container color, a bit lighter
  },
  //colors that can be used for component styling
  customColors: {
    colorText: '#F8F9FB',
    colorBlueDark: '#1A192D',
    colorBlueLight: '#2A274A',
    colorBlueLightHover: '#484568',
    colorPurple: '#5832a2',
    colorPink: '#d84380',
    colorPurpleLight: '#7a4bd1',
    colorPinkLight: '#ff5c9d',
    colorMyMessage: '#292641',
    colorOtherMessage: '#232036',
    colorOnline: 'green',
    colorBusy: 'red',
    colorInactive: 'grey',
    btnLogout: '#2E2A4F',
    colorMainShadow: '#13121C',
    colorGray: '#444',
    colorGradientStart: '#1a133b',
    colorGradientMiddle: '#2e1642',
    colorGradientEnd: '#451e42',
    colorSidebarOverlay: '#0000008C',
    colorMutedText: '#B6B3C7',
  },
  //border radius variants
  customShape: {
    roundedContainer: '20px',
    roundedArea: '10px',
    roundedBtn: '8px',
    roundedAvatar: '50%',
  },
});

// helper for passing theme colors and other styling elements to css
type CSSVars = Record<`--${string}`, string>;
export const rootDivStyle = (theme: Theme): React.CSSProperties & CSSVars => ({
  '--color-primary': theme.palette.primary.main,
  '--color-secondary': theme.palette.secondary.main,
  '--color-text': theme.customColors.colorText,
  '--color-blue-dark': theme.customColors.colorBlueDark,
  '--color-blue-light': theme.customColors.colorBlueLight,
  '--color-blue-light-hover': theme.customColors.colorBlueLightHover,
  '--color-purple': theme.customColors.colorPurple,
  '--color-purple-light': theme.customColors.colorPurpleLight,
  '--color-pink': theme.customColors.colorPink,
  '--color-pink-light': theme.customColors.colorPinkLight,
  '--color-main-shadow': theme.customColors.colorMainShadow,
  '--rounded-container': theme.customShape.roundedContainer,
  '--rounded-area': theme.customShape.roundedArea,
  '--rounded-btn': theme.customShape.roundedBtn,
  '--rounded-avatar': theme.customShape.roundedAvatar,
});

export default theme;
