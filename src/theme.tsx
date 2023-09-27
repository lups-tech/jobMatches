import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
      primary: {
        main: '#8caaee',
        light: '#8caaee',
        dark: '#8caaee',
        contrastText: '#ffffff',
      } ,
      secondary: {
        main: '#3A3C4E',
        light: '#E7EBFF',
        dark: '#3A3C4E',
        contrastText: '#ffffff',
      },
      error: {
        main: '#3A3C4E',
        light: '#E7EBFF',
        dark: '#3A3C4E',
        contrastText: '#ffffff',
      },
      // warning: {

      // },
      // info: {

      // },
      // success: {

      // }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          borderRadius: '30px',
          background: '#3A3C4E',
          paddingInline: '30px',
          color: 'white',
          textTransform: 'capitalize',
          fontWeight: '400',
        },
      },
    },
  },
});

const GlobalThemeOverride = ({ children }: React.PropsWithChildren) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GlobalThemeOverride;
