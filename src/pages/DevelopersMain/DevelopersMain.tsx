import { useState } from 'react';
import DevForm from './components/DevForm';
import AllDevs from './components/AllDevs';
import { Button, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  fetchDevelopers,
  fetchSkills,
  fetchUserInfo,
} from '../../utils/fetchingTools';
import { Skill, Developer, UserInfoDTO } from '../../types/innerTypes';
import { useAuth0 } from '@auth0/auth0-react';

export const DevelopersMainRoute = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [showForm, setShowForm] = useState(false);
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });

  const {
    isLoading,
    error,
    data: allDevelopers,
  } = useQuery<Developer[], Error>({
    queryKey: ['allDevelopers'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      return fetchDevelopers(accessToken);
    },
  });

  const {
    isLoading: isUserInfoLoading,
    error: isUserInfoError,
    data: userInfo,
  } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      return fetchUserInfo(accessToken, user?.sub ? user.sub : '');
    },
  });

  if (isLoading || isSkillsLoading || isUserInfoLoading)
    return (
      <div className="flex justify-center mt-24 w-full">
        <CircularProgress />
      </div>
    );

  if (error || skillsError || isUserInfoError) {
    console.log('❗️error: ', error);
    return (
      <div className="flex justify-center mt-24 w-full">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!skills) {
    return;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center my-5">
        <Button onClick={handleShowForm} className="w-[600px] mx-auto">
          {showForm ? 'Show Developers' : 'Add a Developer'}
        </Button>
      </div>

      {showForm && <DevForm />}
      {!showForm && (
        <AllDevs
          allDevelopers={allDevelopers}
          skills={skills}
          userInfo={userInfo}
        />
      )}
    </div>
  );
};
