import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { NavBarButtons } from './buttons/NavBarButtons';
import { useAuth0 } from '@auth0/auth0-react';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1130px)');

  return (
    isMobile ? <MobileNavbar /> :
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
          {isAuthenticated && (
            <div className="flex flex-row gap-15 justify-center items-center">
              <Link
                to="/developers"
                color="#ffffff"
                className={`border-b-[6px] pt-[28px] pb-[12px] w-[120px] text-center
                ${
                  location.pathname === '/developers'
                    ? 'border-slate-100 font-bold'
                    : 'border-transparent'
                }`}
              >
                Developers
              </Link>
              <Link
                to="/jobs"
                color="#ffffff"
                className={`border-b-[6px] pt-[28px] pb-[12px] w-[120px] text-center
                ${
                  location.pathname === '/jobs'
                    ? 'border-slate-100 font-bold'
                    : 'border-transparent'
                }`}
              >
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
