import { Button, Card, CardActions, Typography } from '@mui/material';
import { Job } from '../types/types';

interface IJobCard { jobInfo: Job }

const JobCard = ({jobInfo}:IJobCard) => {
  return (
    <>
      <Card sx={{ minWidth: 275}}>
        <Typography variant="h3" gutterBottom>{jobInfo.headline}</Typography>
        <Typography variant="h4" gutterBottom>{jobInfo.employer.name}</Typography>
        <Typography variant="body1" gutterBottom>{jobInfo.description.text_formatted}</Typography>
        <CardActions>
          <Button size="small">More Info</Button>
        </CardActions>
      </Card>
    </>
  )
}

export default JobCard