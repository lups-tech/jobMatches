import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Root() {
    return (
      <main className="bg-slate-50 min-h-[100svh] pt-24">
        <Navbar/>
         <Outlet />
      </main>
    );
  }