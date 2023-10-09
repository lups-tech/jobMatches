import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LogInButton';
import { LogoutButton } from './LogOutButton';
import UserBadgeButton from './UserBadgeButton';
import ToggleMode from './ToggleModeButton';

export const NavBarButtons = () => {
  const {
    user: userInfo,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useAuth0();

  return (
    <div className="nav-bar__buttons">
      {!isAuthenticated && (
        <div className="flex flex-row gap-4">
          <LoginButton />
          <ToggleMode />
        </div>
      )}
      {isAuthenticated && (
        <div className="flex flex-row items-center gap-4">
          <UserBadgeButton loading={isUserLoading} user={userInfo!} />
          <LogoutButton />
          <ToggleMode />
        </div>
      )}
    </div>
  );
};
