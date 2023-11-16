import { AppBar, Toolbar, useMediaQuery } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import Groups2Icon from '@mui/icons-material/Groups2';
import WorkIcon from '@mui/icons-material/Work';
import { Link, useLocation } from 'react-router-dom';
import { NavBarButtons } from './buttons/NavBarButtons';
import { useAuth0 } from '@auth0/auth0-react';
import { MobileNavbar } from './MobileNavbar';

export const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 900px)');

  return isMobile ? (
    <MobileNavbar />
  ) : (
    <AppBar
      position="relative"
      color="primary"
      enableColorOnDark
      className="h-16"
      sx={{ boxShadow: 0, marginBottom: 0 }}
    >
      <Toolbar>
        <div className="w-full grid grid-cols-3 h-full">
          <div className="flex flex-row justify-start items-center pt-6">
            <Link to="/" color="#ffffff" className={`border-b-[4px] h-full ${
                    isAuthenticated && location.pathname === '/'
                      ? 'border-slate-100 font-bold'
                      : 'border-transparent'
                  }`}>
                <HubIcon sx={{marginBottom: "0.1rem", marginRight: '0.3rem'}}/>
                TalentHub
            </Link>
          </div>
          <div className="flex flex-row gap-15 justify-center items-center h-full">
            {isAuthenticated && (
              <div className={`border-b-[4px] h-full pt-6 mx-4
              ${
                location.pathname === '/developers'
                  ? 'border-slate-100 font-bold'
                  : 'border-transparent'
              }`}>
                <Link
                  to="/developers"
                  color="#ffffff"
                >
                    <Groups2Icon sx={{marginBottom: "0.1rem", marginRight: '0.3rem'}}/>
                    Developers
                </Link>
              </div>
            )}
            <div className={`border-b-[4px] h-full pt-6 mx-4
                  ${
                    location.pathname === '/jobs'
                      ? 'border-slate-100 font-bold'
                      : 'border-transparent'
                  }`}>
              <Link
                to="/jobs"
                color="#ffffff"
              >
                  <WorkIcon sx={{marginBottom: "0.1rem", marginRight: '0.3rem'}}/>
                  Jobs
              </Link>
            </div>
            </div>

          <div className="flex flex-row justify-end items-center pt-1">
            <NavBarButtons />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};
