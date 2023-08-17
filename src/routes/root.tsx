import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Root() {
    return (
      <main>
        <Navbar/>
        <div className='mt-24'>
         <Outlet />
        </div>
      </main>
    );
  }