import { CircularProgress } from '@mui/material';
import { AboutUs } from '../pages/AboutUs/AboutUs';
import { Dashboard } from '../pages/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';

export const HomeRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Dashboard />;
  }
  return <AboutUs />;
};
