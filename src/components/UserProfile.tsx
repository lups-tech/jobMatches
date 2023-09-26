import {  useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";

const UserProfile: React.FC = () => {
  const { user: userInfo, isLoading: isUserLoading, isAuthenticated } = useAuth0();

  if (isUserLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    isAuthenticated &&
    <div>
      {userInfo?.email}
    </div>
  )
};

export default UserProfile;


