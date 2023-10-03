import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#8caaee',
      light: '#8caaee',
      dark: '#8caaee',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3A3C4E',
      light: '#E7EBFF',
      dark: '#3A3C4E',
      contrastText: '#ffffff',
    },
    // error: {

    // },
    // warning: {

    // },
    info: {
      main: '#ffffff',
    },
    // success: {

    // },
    mode: 'light',
    background: {
      default: '#f4f6f8', // This is the default background color for light mode
      paper: '#ffffff', // This is the background color for components in light mode
    },
    // text: {
    //   primary: '#ffffff',
    //   secondary: '#bbbbbb',
    // },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          borderRadius: '24px',
          background: '#3A3C4E',
          paddingInline: '30px',
          color: 'white',
          textTransform: 'capitalize',
          fontWeight: '400',
          '&:hover': {
            backgroundColor: '#8caaee',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    info: {
      main: '#111111',
    },
    mode: 'dark',
    // text: {
    //   primary: '#000000', // primary text color for dark mode
    //   secondary: '#555555', // secondary text color for dark mode
    // },
    background: {
      default: '#303030', // This is the default background color for dark mode
      paper: '#424242', // This is the background color for components in dark mode
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          borderRadius: '24px',
          background: '#3A3C4E',
          paddingInline: '30px',
          color: 'white',
          textTransform: 'capitalize',
          fontWeight: '400',
          '&:hover': {
            backgroundColor: '#8caaee',
          },
        },
      },
    },
  },
});

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

const GlobalThemeOverride = ({ children }: React.PropsWithChildren) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default GlobalThemeOverride;
