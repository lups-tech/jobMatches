import { useAuth0 } from '@auth0/auth0-react';
import { fetchUserInfo } from '../utils/fetchingTools';
import { useQuery } from '@tanstack/react-query';
import { UserInfoDTO } from '../types/innerTypes';
import { CircularProgress } from '@mui/material';
import DevList from '../components/DevList';

const Dashboard = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const {
    isLoading: isUserInfoLoading,
    error: isUserInfoError,
    data: userInfo,
  } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
      }
      return { jobs: [] };
    },
  });

  if (isUserInfoLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (isUserInfoError) {
    console.log('❗️error: ', isUserInfoError);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!userInfo) {
    return;
  }

  return (
    <>
      <DevList developers={userInfo.developers} />
    </>
  );
};

export default Dashboard;
