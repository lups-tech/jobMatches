import { Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, Typography, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Job } from '../types/externalTypes';
import { useNavigate } from 'react-router-dom'; 
import { useState } from 'react';


interface IJobCard { jobInfo: Job }
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

const JobCard = ({jobInfo}:IJobCard) => {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate()
  const handleMatching = () => {
    navigate('job-matches', { state: jobInfo })
  } 

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // console.log('❗️text:', JSON.stringify(jobInfo.description.text))

  return (
    <>
      <Card sx={{ minWidth: 600 }}>
        <CardHeader />

        <CardContent>
          <Typography color="text.secondary" gutterBottom>{jobInfo.application_deadline}</Typography>
          <Typography variant="h5" gutterBottom>{jobInfo.headline}</Typography>
          <Typography variant="h6" gutterBottom>{jobInfo.employer.name}</Typography>
          <div> 
            {Object.values(jobInfo.must_have).some(arr => arr.length > 0) && <Typography>Must have: </Typography>}
            {Object.entries(jobInfo.must_have).map(([key, values]) =>
              values.length > 0 && (
                <Typography key={key}><strong>{key.replace('_', ' ')}:</strong> {values.map(item => item.label).join(", ")}</Typography>
                )
                )}
          </div>
          <div>
            {Object.values(jobInfo.nice_to_have).some(arr => arr.length > 0) && <p>Nice to have: </p>}
            {Object.entries(jobInfo.nice_to_have).map(([key, values]) =>
              values.length > 0 && (
                <p key={key}><strong>{key}:</strong> {values.map(item => item.label).join(", ")}</p>
              )
            )}
          </div>

        </CardContent>

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            {/* show <FavoriteIcon> if this job is saved */}
            <FavoriteBorderIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div dangerouslySetInnerHTML={{__html: JSON.stringify(jobInfo.description.text_formatted).replace(/[\n\r]/g, "<br/>")}}></div>
          </CardContent>
        </Collapse>
        <CardActions>
          <Button size="small" onClick={handleMatching}>Match developers</Button>
        </CardActions>

      </Card>
    </>
  )
}

export default JobCard