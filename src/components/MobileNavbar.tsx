import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { LogoutButton } from './buttons/LogOutButton';
import ToggleMode from './buttons/ToggleModeButton';
import UserBadgeButton from './buttons/UserBadgeButton';
import { LoginButton } from './buttons/LogInButton';

const MobileNavbar = () => {
  const {
    isAuthenticated,
    user: userInfo,
    isLoading: isUserLoading,
  } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

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
            <IconButton
              id="mobile-nav-button"
              color="info"
              sx={{ '&:hover': { backgroundColor: '#3A3C4E' }, marginLeft: 2 }}
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
                'disablePadding': true,
              }}
              sx={{borderRadius: 0}}
            >
              {isAuthenticated ? (
                <div>
                  <MenuItem onClick={handleClose} sx={{background: '#8caaee'}}>
                    <UserBadgeButton user={userInfo!} loading={isUserLoading} />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      to="/developers"
                      color="#ffffff"
                      className={
                        location.pathname === '/developers' ? 'font-bold' : ''
                      }
                    >
                      Developers
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      to="/jobs"
                      color="#ffffff"
                      className={
                        location.pathname === '/jobs' ? 'font-bold' : ''
                      }
                    >
                      Jobs
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <LogoutButton />
                  </MenuItem>
                </div>
              ) : (
                <MenuItem onClick={handleClose}>
                  <LoginButton/>
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MobileNavbar;
