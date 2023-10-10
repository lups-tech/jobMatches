import { useAuth0 } from '@auth0/auth0-react';
import { Button, Tooltip } from '@mui/material';
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
      <Button sx={{fontSize: 12, minWidth: "170px"}} startIcon={<LoginIcon />} onClick={handleLogin}>
        Log In
      </Button>
    </Tooltip>
  );
};
