
import { PropsWithChildren, createContext, useContext, useState } from 'react';


type UserContext = {
 userData: User,
 updateUser: (data: User) => void
}

type User = {
  auth0Id:string | undefined,
  name:string | undefined,
  email:string | undefined,
}

const UserContext = createContext<UserContext>({
  userData: {auth0Id:'', name:'', email:''},
  updateUser: () => {}
});


export const useUserContext = () => {
const context = useContext(UserContext);
return context;
};

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<User>({auth0Id:'', name:'', email:''});

  const updateUser = (data: User) => {
    setUserData(data);
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};