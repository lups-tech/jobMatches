import { useQuery } from '@tanstack/react-query';
import { Job, SearchResult } from '../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { FilterFormValues, Skill, UserInfoDTO } from '../types/innerTypes';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';
import { useAuth0 } from '@auth0/auth0-react';
import { mockSkills } from '../data/mockSkills';
import { fetchUserInfo } from '../utils/fetchingTools';

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (accessToken: string): Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

const fetchJobs = async (
  searchFilter: FilterFormValues,
  page: number
): Promise<SearchResult> => {
  const res = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?${searchFilter.regionFilter
      .map(
        region => `region=${region['taxonomy/national-nuts-level-3-code-2019']}`
      )
      .join('&')}&experience=${
      searchFilter.isExperienced
    }&q=${encodeURIComponent(
      searchFilter.skillsFilter.join(' ') + ' ' + searchFilter.searchKeyword
    )}&offset=${page * 10}&limit=10`
  );
  return res.json();
};

const AllJobs = () => {
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
    }
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
                .map(jobOfUser => jobOfUser.jobTechId)
                .includes(job.id);
              const databaseId = () => {
                if (isLikedJob) {
                  const selectedJob = userInfo.jobs.find(
                    userJob => userJob.jobTechId == job.id
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

export default AllJobs;