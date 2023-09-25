

// type User = {
//   auth0Id:string | undefined,
//   name:string | undefined,
//   email:string | undefined,
// }

import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const UserProfile = () => {


  const { user, isAuthenticated, isLoading } = useAuth0();

  const context = useUserContext();

console.log(user)
 

//   const [userData, setUserData] =  useState<User>({ auth0Id:'',
//   name:'',
//   email:''})

//   const updateUserData = () => {
//     setUserData({
      // auth0Id: user?.sub,
      // name: user?.name,
      // email: user?.email,
//     });
//   };

  useEffect(()=>{
    context.updateUser({
      auth0Id: user?.sub,
      name: user?.name,
      email: user?.email,
    });
  }, [])

console.log(context.userData);

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
        <h2>Welcome {context.userData.name}</h2>   
        <p>{}</p>
      </div>
  
    )
  );
};

export default UserProfile;


