import { useAuth0 } from "@auth0/auth0-react";
import { SignupButton } from './signup-button';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';

export const NavBarButtons = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__buttons">
      {!isAuthenticated && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};