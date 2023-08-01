import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type JobData = {
    id: string
    description:  {
        text: string
    }
}

const hardCodedId = '27894030'

const fetchJobById = async (id: string) => {
    const res = await axios.get(`https://jobsearch.api.jobtechdev.se/ad/${id}`);
    return res.data;
}

const JobMatches = (id: string) => {
    const {
        isLoading,
        error,
        data
      } = useQuery<JobData, Error>( ['job'], () => fetchJobById(hardCodedId));

      if (isLoading) return 'Loading...'

      if (error) return 'An error has occurred: ' + error.message

    return <><div>Hello! You can match developers to a job here. {data.id}</div><Button variant="contained">Testing MUI and it works!</Button></>
}

export default JobMatches;