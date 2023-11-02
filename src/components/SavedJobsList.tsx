import { CircularProgress, Typography } from '@mui/material';
import { JobDTO, Skill } from '../types/innerTypes';
import SavedJobCard from './SavedJobCard';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchSkills } from '../utils/fetchingTools';

const SavedJobsList = ({
  jobs,
  userId,
}: {
  jobs: JobDTO[];
  userId: string;
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });
  if (isSkillsLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (skillsError) {
    console.log('❗️error: ', skillsError);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }
  if (!skills) {
    return;
  }

  return (
    <div className="w-[415px] mx-5">
      <Typography variant="h5">Saved Jobs</Typography>
      <div className="w-full h-[600px] mx-auto overflow-hidden hover:overflow-y-auto">
        <div className="w-[400px]">
          {jobs &&
            jobs.length > 0 &&
            jobs.map(job => (
              <SavedJobCard
                key={job.id}
                databaseId={job.id}
                jobInfo={job}
                isLiked={true}
                userId={userId}
                allSkills={skills}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SavedJobsList;
