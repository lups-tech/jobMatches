import {  useAuth0 } from "@auth0/auth0-react";
import { Avatar, Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { AlignHorizontalCenter, FormatAlignJustify } from "@mui/icons-material";



const UserProfile: React.FC = () => {
  const { user: userInfo, isLoading: isUserLoading, isAuthenticated } = useAuth0();


  console.log(userInfo)
  if (isUserLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    isAuthenticated &&

<div className="flex justify-center">
      <div className="max-w-[800px] mx-10"> 
    {userInfo?.picture === undefined ? <Avatar sx={{ width: 56, height: 56 }}>T</Avatar> : 
    <Avatar alt="Profie pic" src={userInfo.picture} sx={{ width: 56, height: 56}}/>} 
      <Typography  variant="h5" gutterBottom> 
        {userInfo?.name}
          </Typography>
      <Typography variant="body1"><EmailIcon fontSize="small" sx={{ marginRight: 1}} />
          {userInfo?.email}
          </Typography>
    </div>
    </div>
  )
};

export default UserProfile;


