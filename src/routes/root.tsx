import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Auth0ProviderWithNavigate } from '../auth0-provider-with-navigate';
import { useAuth0 } from '@auth0/auth0-react';

export default function Root() {
  
    return (
      <Auth0ProviderWithNavigate>
        <main className="bg-slate-50 min-h-[100svh] pt-24">
          <Navbar/>
          <Outlet />
        </main>
      </Auth0ProviderWithNavigate>
    );
  } 