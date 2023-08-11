import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar>
        <Toolbar className="flex justify-between">
            <div>Logo</div>
            <div className="flex flex-row gap-4">
                <Typography>Developers</Typography>
                <Typography>Jobs</Typography>
            </div>
        </Toolbar>
    </AppBar>
  )
}
