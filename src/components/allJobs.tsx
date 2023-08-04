import { useQuery } from '@tanstack/react-query';
import JobCard from './jobCard'
import { Job, SearchResult,  } from '../types/jobTechApiTypes';
import { CircularProgress } from '@mui/material';

const fetchJobs = async () : Promise<SearchResult> => {
  const res = await fetch('https://jobsearch.api.jobtechdev.se/search?q=javascript&offset=0&limit=10')
  return res.json()
}

const AllJobs = () => {
  const { isLoading, error, data } = useQuery(['jobs'], fetchJobs, {
    // to prevent the page from fetching data too many times
    staleTime: Infinity,
    cacheTime: Infinity
  })

  if (isLoading) return <CircularProgress />

  if (error) {
    console.log('❗️error: ', error)
    return 'An error has occurred: '}
  
  if (data) {
    console.log('⭐️data: ', data)
    return (
    <>
      <div>Hello! You can list the jobs here.</div>
      { data.hits.map((job:Job) => (<JobCard jobInfo={job} />))}
    </>
    )
  }
}

export default AllJobs