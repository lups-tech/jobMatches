import { withAuthenticationRequired } from '@auth0/auth0-react';
import { CircularProgress } from '@mui/material';
import { ComponentType } from 'react';

type GuardProps = {
  component: ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: GuardProps) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout flex w-full mt-24 justify-center">
        <CircularProgress />
      </div>
    ),
  });

  return <Component />;
};
