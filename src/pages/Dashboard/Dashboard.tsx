import { useAuth0 } from '@auth0/auth0-react';
import { fetchMatchingProcess, fetchUserInfo } from '../../utils/fetchingTools';
import { useQuery } from '@tanstack/react-query';
import { MatchingProcess, UserInfoDTO } from '../../types/innerTypes';
import { CircularProgress } from '@mui/material';
import SavedDevsList from './components/SavedDevsList';
import SavedJobsList from './components/SavedJobsList';
import { DataVisualisation } from './components/DataVisualisation';
import axios from 'axios';
import { MatchingProcessTable } from './components/MatchingProcessTable';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const Dashboard = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const userCheck = async () => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      try {
        await axios.post(
          `${backendServer}api/users`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.log('Error:', (error as Error).message);
      }
    }
  };

  const {
    isLoading: isUserInfoLoading,
    error: isUserInfoError,
    data: userInfo,
  } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      if (isAuthenticated) {
        await userCheck();
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
      }
      return { jobs: [] };
    },
  });

  const { data: allMatchingProcesses } = useQuery<MatchingProcess[], Error>({
    queryKey: ['matchingProcess'],
    queryFn: async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        return fetchMatchingProcess(accessToken);
      }
      return {};
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
    <div className="flex flex-col items-center mx-auto">
      <div className="max-w-[1000px] mx-auto my-5 flex flex-wrap gap-0.5 items-center">
        <DataVisualisation />
        <MatchingProcessTable
          userInfo={userInfo}
          matchingProcesses={allMatchingProcesses}
        />
        <SavedDevsList developers={userInfo.developers} />
        <SavedJobsList jobs={userInfo.jobs} userId={userInfo.id} />
      </div>
    </div>
  );
};
