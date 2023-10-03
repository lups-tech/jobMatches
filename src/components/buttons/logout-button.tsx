import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Tooltip title="Logout">
      <IconButton color="info" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};
