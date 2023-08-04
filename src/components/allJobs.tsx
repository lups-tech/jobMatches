import { useQuery } from '@tanstack/react-query';
import JobCard from './jobCard'
import { Job, SearchResult,  } from '../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import JobFilters from './jobFilters';
import { ChangeEvent, useState } from 'react';

const fetchJobs = async (keyword:string, page:string) : Promise<SearchResult> => {
  const res = await fetch(`https://jobsearch.api.jobtechdev.se/search?q=${keyword.toLowerCase()}&offset=${page}&limit=10`)
  return res.json()
}

const AllJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState('JavaScript')
  const [currentPage, setCurrentPage] = useState('0')

  const { isLoading, error, data } = useQuery<SearchResult>(['jobs', searchKeyword], () => fetchJobs(searchKeyword,currentPage), {
    // to prevent the page from fetching data too many times
    // staleTime: Infinity,
    // cacheTime: Infinity
  })

  const pageChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
    const valueString = (value - 1).toString()
    if (valueString) {
      setCurrentPage(valueString)
    }
  }

  if (isLoading) return <CircularProgress />

  if (error) {
    console.log('❗️error: ', error)
    return 'An error has occurred, check console for more info' }
  
  if (data) {
    console.log('⭐️data: ', data)
    return (
    <>
      <JobFilters setSearchKeyword={setSearchKeyword}/>
      <div className='jobcards'>
        { data.hits.map((job:Job) => (<JobCard key={job.id} jobInfo={job} />))}
      </div>
      <Pagination count={Math.floor(data.positions / 10) + 1} variant="outlined" shape="rounded" onChange={pageChangeHandler} />
    </>
    )
  }
}

export default AllJobs