import { CircularProgress } from '@mui/material';
import AboutUs from '../components/AboutUs';
import { Dashboard } from '../pages';
import { useAuth0 } from '@auth0/auth0-react';

const HomeRoute = () => {
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

export default HomeRoute;
