import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
import AllJobsRoute from './routes/all-jobs.tsx';
import SkillFormRoute from './routes/skill-form.tsx';
import DevFormRoute from './routes/dev-form.tsx';
import JobMatchesRoute from './routes/job-matches.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import HomeRoute from './routes/home.tsx';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate.tsx';

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
        element: <DevFormRoute />,
      },
      {
        path: 'developers/:id/skills',
        element: <SkillFormRoute />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider> 
  </React.StrictMode>
);
