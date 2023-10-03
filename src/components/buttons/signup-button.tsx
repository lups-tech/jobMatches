import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Tooltip } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: '/',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  return (
    <Tooltip title="Sign Up">
      <IconButton color="info" onClick={handleSignUp}>
        <PersonOutlineIcon></PersonOutlineIcon>
      </IconButton>
    </Tooltip>
  );
};
