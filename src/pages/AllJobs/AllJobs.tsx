import { useQuery } from '@tanstack/react-query';
import { Job, SearchResult } from '../../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { FilterFormValues, Skill, UserInfoDTO } from '../../types/innerTypes';
import JobFilters from './components/JobFilters';
import { JobCard } from '../../components';
import { useAuth0 } from '@auth0/auth0-react';
import { mockSkills } from '../../data/mockSkills';
import {
  fetchJobs,
  fetchSkills,
  fetchUserInfo,
} from '../../utils/fetchingTools';

export const AllJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState<FilterFormValues>({
    searchKeyword: 'JavaScript',
    skillsFilter: [],
    regionFilter: [],
    isExperienced: false,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], async () => {
    if (isAuthenticated) {
      const accessToken = await getAccessTokenSilently();
      return fetchSkills(accessToken);
    }
    return mockSkills;
  });

  const {
    isLoading: isUserInfoLoading,
    error: isUserInfoError,
    data: userInfo,
  } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
      }
      return { jobs: [] };
    },
  });

  const { isLoading, error, data } = useQuery<SearchResult>(
    ['jobs', searchKeyword, currentPage],
    () => fetchJobs(searchKeyword, currentPage),
    {
      // to prevent the page from fetching data too many times
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );

  const pageChangeHandler = (_event: ChangeEvent<unknown>, value: number) => {
    value = value - 1;
    setCurrentPage(value);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchKeyword]);

  if (isLoading || isSkillsLoading || isUserInfoLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (error || skillsError || isUserInfoError) {
    console.log('❗️error: ', error);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!data || !skills || !userInfo) {
    return;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        <JobFilters setSearchKeyword={setSearchKeyword} skills={skills} />
        <div className="jobcards">
          {isAuthenticated &&
            // userInfo.jobs &&
            data.hits.map((job: Job) => {
              const isLikedJob = userInfo.jobs
                .map((jobOfUser) => jobOfUser.jobTechId)
                .includes(job.id);
              // A BUG TO BE DEBUGGED
              if (isLikedJob) {
                console.log('job is liked: ', job.headline);
              }
              const databaseId = () => {
                if (isLikedJob) {
                  const selectedJob = userInfo.jobs.find(
                    (userJob) => userJob.jobTechId == job.id,
                  );
                  if (selectedJob) {
                    return selectedJob.id;
                  }
                  return '';
                }
                return '';
              };
              return (
                <JobCard
                  key={job.id}
                  jobInfo={job}
                  isLiked={isLikedJob}
                  databaseId={databaseId()}
                  userId={userInfo.id}
                  allSkills={skills}
                />
              );
            })}
          {!isAuthenticated &&
            data.hits.map((job: Job) => {
              return (
                <JobCard
                  key={job.id}
                  jobInfo={job}
                  isLiked={false}
                  databaseId={''}
                  userId={''}
                  allSkills={skills}
                />
              );
            })}
        </div>
        <div className="flex justify-center my-10">
          <Pagination
            count={Math.floor(data.total.value / 10) + 1}
            color="secondary"
            onChange={pageChangeHandler}
            page={currentPage + 1}
          />
        </div>
      </div>
    </div>
  );
};
