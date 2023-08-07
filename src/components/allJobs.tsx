import { useQuery } from '@tanstack/react-query';
import JobCard from './jobCard'
import { Job, SearchResult,  } from '../types/externalTypes';
import { CircularProgress, Pagination } from '@mui/material';
import JobFilters from './jobFilters';
import { ChangeEvent, useEffect, useState } from 'react';

const fetchJobs = async (keyword:string, page:number) : Promise<SearchResult> => {
  const res = await fetch(`https://jobsearch.api.jobtechdev.se/search?q=${keyword.toLowerCase()}&offset=${page*10}&limit=10`)
  return res.json()
}

const AllJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState('JavaScript')
  const [currentPage, setCurrentPage] = useState(0)

  const { isLoading, error, data } = useQuery<SearchResult>(['jobs', searchKeyword, currentPage], () => fetchJobs(searchKeyword,currentPage), {
    // to prevent the page from fetching data too many times
    staleTime: Infinity,
    cacheTime: Infinity
  })

  const pageChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
    value = value - 1
    setCurrentPage(value)
  }

  useEffect(() => {
    setCurrentPage(0)
  },[searchKeyword])

  if (isLoading) return <CircularProgress />

  if (error) {
    console.log('❗️error: ', error)
    return 'An error has occurred, check console for more info' }
  
  if (data) {
    return (
    <>
      <JobFilters setSearchKeyword={setSearchKeyword}/>
      <div className='jobcards'>
        { data.hits.map((job:Job) => (<JobCard key={job.id} jobInfo={job} />))}
      </div>
      <Pagination count={Math.floor(data.total.value / 10) + 1} 
        variant="outlined" 
        shape="rounded" 
        onChange={pageChangeHandler}
        page={currentPage + 1}
      />
    </>
    )
  }
}

export default AllJobs