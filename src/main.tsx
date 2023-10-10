import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
import AllJobsRoute from './routes/all-jobs.tsx';
import SkillFormRoute from './routes/skill-form.tsx';
import DevelopersMainRoute from './routes/developers-main.tsx';
import JobMatchesRoute from './routes/job-matches.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import HomeRoute from './routes/home.tsx';
import { AuthenticationGuard } from './components/AuthenticationGuard.tsx';
import UserProfileRoute from './routes/user-profile.tsx';
import GlobalThemeOverride from './theme.tsx';
import { CssBaseline } from '@mui/material';

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
    <GlobalThemeOverride>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GlobalThemeOverride>
  </React.StrictMode>
);
