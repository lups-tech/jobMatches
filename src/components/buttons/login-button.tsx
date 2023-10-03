import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Tooltip } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: '/',
      },
    });
  };

  return (
    <Tooltip title="Login">
      <IconButton color="info" onClick={handleLogin}>
        <LoginIcon></LoginIcon>
      </IconButton>
    </Tooltip>
  );
};
