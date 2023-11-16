import { AppBar, Button, Toolbar, useMediaQuery } from '@mui/material';
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
          <div className="flex flex-row justify-start align-middle items-center pt-2">
            <Link to="/" color="#ffffff">
              <Button variant='text' sx={{marginLeft: '-1rem'}}>
                <HubIcon sx={{marginRight: '0.3rem'}}/>
                TalentHub
              </Button>
            </Link>
          </div>
          <div className="flex flex-row gap-15 justify-center items-center h-full">
            {isAuthenticated && (
              <div className={`border-b-[4px] h-full pt-4
              ${
                location.pathname === '/developers'
                  ? 'border-slate-100 font-bold'
                  : 'border-transparent'
              }`}>
                <Link
                  to="/developers"
                  color="#ffffff"
                >
                  <Button variant='text'>
                    <Groups2Icon sx={{marginRight: '0.3rem'}}/>
                    Developers
                  </Button>
                </Link>
              </div>
            )}
            <div className={`border-b-[4px] h-full pt-4
                  ${
                    location.pathname === '/jobs'
                      ? 'border-slate-100 font-bold'
                      : 'border-transparent'
                  }`}>
              <Link
                to="/jobs"
                color="#ffffff"
                
              >
                <Button variant="text">
                  <WorkIcon sx={{marginRight: '0.3rem'}}/>
                  Jobs
                </Button>
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
