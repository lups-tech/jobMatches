import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useThemeContext } from '../../theme';

const ToggleMode = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <Tooltip title={`${darkMode ? 'light mode' : 'dark mode'}`}>
      <IconButton
        sx={{ '&:hover': { backgroundColor: '#3A3C4E' } }}
        aria-label="dark mode toggle button"
        color="info"
        onClick={toggleDarkMode}
      >
        {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleMode;
