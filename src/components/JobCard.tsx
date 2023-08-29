/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Job } from '../types/externalTypes';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface IJobCard {
  jobInfo: Job;
}
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const JobCard = ({ jobInfo }: IJobCard) => {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  const handleMatching = () => {
    navigate('matches', { state: jobInfo });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ minWidth: 30, marginBlock: 2, paddingInline: 5 }}>
      <CardHeader />
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {jobInfo.application_deadline.split('T')[0]}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {jobInfo.headline}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {jobInfo.employer.name}
        </Typography>
        <div>
          {Object.values(jobInfo.must_have).some((arr) => arr.length > 0) && (
            <Typography>Must have: </Typography>
          )}
          {Object.entries(jobInfo.must_have).map(
            ([key, values]) =>
              values.length > 0 && (
                <Typography key={key}>
                  <strong>{key.replace('_', ' ')}:</strong>{' '}
                  {values.map((item) => item.label).join(', ')}
                </Typography>
              )
          )}
        </div>
        <div>
          {Object.values(jobInfo.nice_to_have).some(
            (arr) => arr.length > 0
          ) && <p>Nice to have: </p>}
          {Object.entries(jobInfo.nice_to_have).map(
            ([key, values]) =>
              values.length > 0 && (
                <p key={key}>
                  <strong>{key}:</strong>{' '}
                  {values.map((item) => item.label).join(', ')}
                </p>
              )
          )}
        </div>
      </CardContent>

      <CardActions disableSpacing sx={{paddingBottom: 3}}>
        {/* <IconButton aria-label="add to favorites">
          show <FavoriteIcon> if this job is saved
          <FavoriteBorderIcon />
        </IconButton> */}
        <Button size="small" variant='outlined' onClick={handleMatching}>
          Match developers
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{
              __html: 
                jobInfo.description.text_formatted,
            }}
          ></div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default JobCard;
