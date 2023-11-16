import { AppBar, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Groups2Icon from '@mui/icons-material/Groups2';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { LoginButton } from './buttons/LogInButton';
import ToggleMode from './buttons/ToggleModeButton';
import UserBadgeButton from './buttons/UserBadgeButton';

export const MobileNavbar = () => {
  const {
    isAuthenticated,
    user: userInfo,
    isLoading: isUserLoading,
    logout,
  } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="relative"
      color="primary"
      enableColorOnDark
      className="h-16"
      sx={{ boxShadow: 0, marginBottom: 0 }}
    >
      <Toolbar>
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row justify-start align-middle items-center">
            <Link to="/" color="#ffffff">
              TalentHub
            </Link>
          </div>
          <div>
            <ToggleMode />
            {isAuthenticated ? (
              <>
                <IconButton
                  id="mobile-nav-button"
                  color="info"
                  sx={{
                    '&:hover': { backgroundColor: '#3A3C4E' },
                    marginLeft: 2,
                  }}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="mobile-nav-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    disablePadding: true,
                  }}
                  sx={{ borderRadius: 0 }}
                >
                  <div className="bg-Blue">
                    <MenuItem onClick={handleClose}>
                      <UserBadgeButton
                        user={userInfo!}
                        loading={isUserLoading}
                      />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        to="/developers"
                        className={
                          location.pathname === '/developers' ? 'font-bold' : ''
                        }
                        style={{ color: '#ffffff' }}
                      >
                        <Groups2Icon /> Developers
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        to="/jobs"
                        style={{ color: '#ffffff' }}
                        className={
                          location.pathname === '/jobs' ? 'font-bold' : ''
                        }
                      >
                        <WorkIcon /> Jobs
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      {/* <LogoutButton /> */}
                      <Link
                        to=""
                        style={{ color: '#ffffff' }}
                        onClick={handleLogout}
                      >
                        <LogoutIcon /> Log out
                      </Link>
                    </MenuItem>
                  </div>
                </Menu>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};
