import { Button, Card, CardActions, Typography } from '@mui/material';
import { Job } from '../types/jobTechApiTypes';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

interface IJobCard { jobInfo: Job }

const JobCard = ({jobInfo}:IJobCard) => {
  const navigate = useNavigate()
  const handleMatching = () => {
    navigate('job-matches', { state: jobInfo })
  } 

  return (
    <>
      <Card sx={{ minWidth: 275}}>
        <Typography variant="h3" gutterBottom>{jobInfo.headline}</Typography>
        <Typography variant="h4" gutterBottom>{jobInfo.employer.name}</Typography>
        <Typography variant="body1" gutterBottom>{jobInfo.description.text_formatted}</Typography>
        <CardActions>
          <Button size="small" onClick={handleMatching}>Match developers</Button>
        </CardActions>
      </Card>
    </>
  )
}

export default JobCard