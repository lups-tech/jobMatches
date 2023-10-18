import { Typography } from '@mui/material';
import { JobDTO } from '../types/innerTypes';
import SavedJobCard from './SavedJobCard';

const SavedJobsList = ({
  jobs,
  userId,
}: {
  jobs: JobDTO[];
  userId: string;
}) => {
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
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SavedJobsList;
