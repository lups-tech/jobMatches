import { Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Matches } from '../types/scraperTypes';
import { Job } from '../types/jobTechApiTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { mockDevelopers } from '../data/mockDevelopers';
import { fetchMatches } from '../utils/fetchingTools';
import { findMatchingSkills, sortMockDevelopers } from '../utils/utilities';
import JobMatchesJobPaper from './JobMatchesJobPaper';
import JobMatchesDevPaper from './JobMatchesDevPaper';

type LocationState = {
  state: Job;
};

const JobMatches = () => {
  const { state: jobInfo } = useLocation() as LocationState;
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const {
    isLoading,
    error,
    data: matches,
  } = useQuery<Matches, Error>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        return fetchMatches(jobInfo, accessToken);
      }
      const matchingSkills = findMatchingSkills(jobInfo);
      const developersSorted = sortMockDevelopers(
        mockDevelopers,
        matchingSkills
      );
      return {
        developers: developersSorted,
        jobSkills: matchingSkills,
      };
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-start">
      <JobMatchesJobPaper jobInfo={jobInfo} matches={matches} />
      <div className="max-w-md flex-grow">
        <Typography variant="h2">Best Matches</Typography>
        <div className="h-[600px] w-[460px] mx-auto overflow-hidden hover:overflow-y-auto">
          {matches.developers.length > 0 ? (
            matches.developers.map(dev => (
              <JobMatchesDevPaper dev={dev} matches={matches} />
            ))
          ) : (
            <Paper
              elevation={1}
              sx={{
                padding: 2,
                marginBottom: 2,
                borderRadius: 6,
                // Following logic is to color the dev card based on the first Programming Language they have
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h5">No good matches</Typography>
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatches;
