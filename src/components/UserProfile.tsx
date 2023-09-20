
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";


const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div>
        <h2>Welcome {user!.name}</h2>   
      </div>
    )
  );
};

export default UserProfile;


