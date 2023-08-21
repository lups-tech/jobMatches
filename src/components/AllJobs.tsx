import { useQuery } from '@tanstack/react-query';
import { Job, SearchResult } from '../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Skill } from '../types/innerTypes';
import JobFilters from './JobFilters';
import JobCard from './JobCard';

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (): Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`);
  return res.json();
};

const fetchJobs = async (
  keyword: string,
  page: number
): Promise<SearchResult> => {
  const res = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?q=${keyword.toLowerCase()}&offset=${
      page * 10
    }&limit=10`
  );
  return res.json();
};

const AllJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState('JavaScript');
  const [currentPage, setCurrentPage] = useState(0);

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], fetchSkills);

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

  if (isLoading || isSkillsLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (error || skillsError) {
    console.log('❗️error: ', error);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!data || !skills) {
    return;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        <JobFilters setSearchKeyword={setSearchKeyword} skills={skills} />
        <div className="jobcards">
          {data.hits.map((job: Job) => (
            <JobCard key={job.id} jobInfo={job} />
          ))}
        </div>
        <Pagination
          count={Math.floor(data.total.value / 10) + 1}
          variant="outlined"
          shape="rounded"
          onChange={pageChangeHandler}
          page={currentPage + 1}
        />
      </div>
    </div>
  );
};

export default AllJobs;