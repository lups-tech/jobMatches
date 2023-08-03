import { Button, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Matches } from '../types/scraperTypes';
import { Job } from '../types/jobTechApiTypes';

type LocationState = {
  state: Job;
};

const fetchMatches = async (job: Job) => {
  const res = await axios.get(
    `http://localhost:5092/scraper?text=${encodeURIComponent(
      job.description.text
    )}`
  );
  return res.data;
};

const JobMatches = () => {
  const { state: jobInfo } = useLocation() as LocationState;
  const {
    isLoading,
    error,
    data: matches,
  } = useQuery<Matches, Error>({
    queryKey: ['developers'],
    queryFn: () => fetchMatches(jobInfo),
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
      <Paper elevation={1} sx={{ maxWidth: 640, padding: 1 }}>
        <p>{jobInfo.headline}</p>
        <p>{jobInfo.description.text}</p>
        <Button variant="contained">Save Job</Button>
      </Paper>
      <div className='max-w-md flex-grow'>
      {matches.developers.map(dev =>
        (
          <Paper elevation={1} sx={{padding: 1, marginBottom: 1 }}>
            <p>{dev.name}</p>
            <p>{dev.email}</p>
            {dev.skills.map(skill => <p>{skill.title}</p>)}
          </Paper>
        )
      )}
      </div>
    </div>
  );
};

export default JobMatches;
