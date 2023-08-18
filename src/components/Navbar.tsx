import { AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar>
        <Toolbar className="flex justify-between">
            <Link to="/" color="#ffffff">TalentHub</Link>
            <div className="flex flex-row gap-4">
                <Link to="/developers" color="#ffffff">Developers</Link>
                <Link to="/jobs" color="#ffffff">Jobs</Link>
            </div>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar