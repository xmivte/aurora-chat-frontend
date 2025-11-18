import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#141025',
    },
  },
});

export default theme;
