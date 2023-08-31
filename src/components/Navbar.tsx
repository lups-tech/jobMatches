import { AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { NavBarButtons } from './buttons/nav-bar-buttons';

const Navbar = () => {
  return (
    <AppBar className='h-16 fixed'>
        <Toolbar className="flex justify-between">
            <Link to="/" color="#ffffff">TalentHub</Link>
            <div className="flex flex-row gap-4">
                <Link to="/developers" color="#ffffff">Developers</Link>
                <Link to="/jobs" color="#ffffff">Jobs</Link>
            </div>
            <NavBarButtons />
        </Toolbar>
    </AppBar>
  )
}

export default Navbar