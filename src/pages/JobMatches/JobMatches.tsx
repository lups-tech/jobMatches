import { Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Matches } from '../../types/scraperTypes';
import { Job } from '../../types/jobTechApiTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { mockDevelopers } from '../../data/mockDevelopers';
import {
  fetchMatches,
  fetchMatchingProcess,
  fetchUserInfo,
} from '../../utils/fetchingTools';
import { findMatchingSkills, sortMockDevelopers } from '../../utils/utilities';
import JobMatchesJobPaper from './components/JobMatchesJobPaper';
import JobMatchesDevPaper from './components/JobMatchesDevPaper';
import { MatchingProcess, UserInfoDTO } from '../../types/innerTypes';

type LocationState = {
  state: Job;
};

const getJobUuid = (userInfo: UserInfoDTO, jobtechId: string) => {
  return userInfo.jobs.find(job => job.jobTechId === jobtechId)?.id;
};

const ifMatched = (
  userInfo: UserInfoDTO,
  matchingProcesses: MatchingProcess[],
  jobtechId: string,
  devId: string
) => {
  const jobId = getJobUuid(userInfo, jobtechId);
  if (jobId) {
    const result = matchingProcesses.find(
      process => process.jobId === jobId && process.developerId === devId
    );
    if (result) {
      return true;
    }
    return false;
  }
  return false;
};

export const JobMatches = () => {
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

  const { data: userInfo } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      if (isAuthenticated) {
        // await userCheck();
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
      }
      return {};
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-start">
      <JobMatchesJobPaper jobInfo={jobInfo} matches={matches} />
      <div className="max-w-md flex-grow">
        <Typography variant="h2">Best Matches</Typography>
        <div className="h-[600px] w-[460px] mx-auto mt-6 overflow-hidden hover:overflow-y-auto">
          {matches.developers.length > 0 ? (
            matches.developers.map(dev => (
              <JobMatchesDevPaper
                key={dev.id}
                dev={dev}
                matches={matches}
                jobInfo={jobInfo}
                matched={
                  userInfo && allMatchingProcesses
                    ? ifMatched(
                        userInfo,
                        allMatchingProcesses,
                        jobInfo.id,
                        dev.id
                      )
                    : false
                }
              />
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
