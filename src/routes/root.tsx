import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Auth0ProviderWithNavigate } from '../auth0-provider-with-navigate';

export default function Root() {

  return (
    <Auth0ProviderWithNavigate>
      <main className="min-h-[100svh]">
      <Navbar />
        <Outlet />
      </main>
    </Auth0ProviderWithNavigate>
  );
}
