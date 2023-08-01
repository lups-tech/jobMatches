import { useQuery } from '@tanstack/react-query';
import JobCard from './jobCard'
import { HitJobFrom_jobtechdev, ResponseFrom_jobtechdev } from '../types/types';

const fetchJobs = async () : Promise<ResponseFrom_jobtechdev> => {
  const res = await fetch('https://jobsearch.api.jobtechdev.se/search?offset=0&limit=10')
  return res.json()
}

const AllJobs = () => {
  const { isLoading, error, data } = useQuery(['jobs'], fetchJobs, {
    // to prevent the page from fetching data too much times
    staleTime: Infinity,
    cacheTime: Infinity
  })

  if (isLoading) return 'Loading...'

  if (error) {
    console.log('error: ', error)
    return 'An error has occurred: '}
  
  if (data) {
    console.log('data: ', data)
    return (
    <>
      <div>Hello! You can list the jobs here.</div>
      { data.hits.map((item:HitJobFrom_jobtechdev) => (<JobCard description={item.description.text} />))}
    </>
    )
  }
}

export default AllJobs