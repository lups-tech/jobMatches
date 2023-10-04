import { AppBar, Box, Container, Grid, Toolbar } from "@mui/material"
import { Link } from 'react-router-dom';
import { NavBarButtons } from "./buttons/nav-bar-buttons"

const AboutUs = () => {
  return (
    <div className="bg-red">
     <AppBar color="primary" enableColorOnDark className="h-16 fixed" sx={{boxShadow: 0, transparent: 0.5}}>
      <Toolbar>
        < div className="w-full grid grid-cols-3">
          <div className="flex flex-row justify-start align-middle items-center">
            <Link to="/" color="#ffffff">
              TalentHub
            </Link>
          </div>
          <div className="flex flex-row gap-4 justify-center items-center">
            <Link to="/developers" color="#ffffff">
              Developers
            </Link>
            <Link to="/jobs" color="#ffffff">
              Jobs
            </Link>
          </div>
          
          <div className="flex flex-row justify-end items-center">
            <NavBarButtons />
          </div>
        </div>
      </Toolbar>
    </AppBar>
    <div className="flex flex-col">
      <div className="flex flex-row pt-16 bg-Blue w-100">
        <div>aaa</div>
        <div>CCC</div>
      </div>
      <div className="flex flex-row pt-10 bg-Blue w-100 gap-10">
        <div>topic 1</div>
        <div>topic 2</div>
        <div>topic 3</div>
      </div>
      <div className="flex flex-row">
        <div>aaa</div>
        <div>--last</div>
      </div>
    </div>
     {/* <Grid sx={{backgroundColor: '#8caaee', margin: 0, paddingTop: 8, overflow:'hidden'}} maxWidth="xl" >
       <Box>Number 1</Box>
       <Box>number 2</Box>
      </Grid>
     <Container>
        <Box>number 3</Box>
        <Box>number 4</Box>
      </Container>
     <Container></Container> */}
    </div>
  )
}

export default AboutUs