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

    // }
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
