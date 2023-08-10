import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
import AllJobsRoute from './routes/all-jobs.tsx';
import SkillFormRoute from './routes/skill-form.tsx';
import DevFormRoute from './routes/dev-form.tsx';
import JobMatchesRoute from './routes/job-matches.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import Navbar from './components/Navbar.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: '',
        element: <AllJobsRoute />,
      },
      {
        path: 'job-matches',
        element: <JobMatchesRoute/>
      },
      {
        path: 'devs',
        element: <DevFormRoute/>
      },
      {
        path: 'devs/skills',
        element: <SkillFormRoute/>
      },
    ]
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Navbar/>
      <div className='mt-36'>
        <RouterProvider router={router}/>
      </div>
    </QueryClientProvider>
  </React.StrictMode>,
)
