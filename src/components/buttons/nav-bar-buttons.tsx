import { useAuth0 } from "@auth0/auth0-react";
import { SignupButton } from './signup-button';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';
import UserBadgeButton from "./user-bagde-button";

export const NavBarButtons = () => {
  const { user: userInfo, isLoading: isUserLoading, isAuthenticated } = useAuth0();

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
        <UserBadgeButton loading={isUserLoading} user={userInfo!}/>
        <LogoutButton />
          
        </>
      )}
    </div>
  );
};