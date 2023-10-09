import { AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { NavBarButtons } from './buttons/NavBarButtons';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <AppBar
      position="relative"
      color="primary"
      enableColorOnDark
      className="h-16"
      sx={{ boxShadow: 0, marginBottom: 0 }}
    >
      <Toolbar>
        <div
          className={
            isAuthenticated
              ? 'w-full grid grid-cols-3'
              : 'w-full grid grid-cols-2'
          }
        >
          <div className="flex flex-row justify-start align-middle items-center">
            <Link to="/" color="#ffffff">
              TalentHub
            </Link>
          </div>
          {/* should occupy a slot if not authenticated */}
          {isAuthenticated && (
            <div className="flex flex-row gap-10 justify-center items-center">
              <Link to="/developers" color="#ffffff">
                Developers
              </Link>
              <Link to="/jobs" color="#ffffff">
                Jobs
              </Link>
            </div>
          )}
          <div className="flex flex-row justify-end items-center">
            <NavBarButtons />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
