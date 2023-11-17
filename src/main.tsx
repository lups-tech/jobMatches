import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
import {
  AllJobsRoute,
  HomeRoute,
  JobMatchesRoute,
  DevelopersMainRoute,
  SkillFormRoute,
  UserProfileRoute,
} from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { AuthenticationGuard } from './components/AuthenticationGuard.tsx';
import GlobalThemeOverride from './theme.tsx';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <HomeRoute />,
      },
      {
        path: 'jobs',
        element: <AllJobsRoute />,
      },
      {
        path: 'jobs/matches',
        element: <JobMatchesRoute />,
      },
      {
        path: 'developers',
        element: <AuthenticationGuard component={DevelopersMainRoute} />,
      },
      {
        path: 'developers/:id/skills',
        element: <AuthenticationGuard component={SkillFormRoute} />,
      },
      {
        path: 'user-profile',
        element: <AuthenticationGuard component={UserProfileRoute} />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GlobalThemeOverride>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </GlobalThemeOverride>
    </LocalizationProvider>
  </React.StrictMode>
);
