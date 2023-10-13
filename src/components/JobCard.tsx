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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Job } from '../types/externalTypes';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

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

const backendServer = import.meta.env.VITE_BE_SERVER;

const JobCard = ({ jobInfo, isLiked, databaseId, userId }: { jobInfo: Job; isLiked: boolean; databaseId: string; userId: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(isLiked);
  const [idForDelete, setIdforDelete] = useState(databaseId);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const likeRequest = async (
    requestMethod: string,
    requestBody: {
      url: string;
      jobTechId: string;
      jobText: string;
      selectedSkillIds?: string[];
    }
  ) => {
    const accessToken = await getAccessTokenSilently();
    if(requestMethod == 'POST'){
      try {
        const response = await fetch(`${backendServer}api/jobs`, {
          method: requestMethod,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        })
        if(response.ok){
          response.json()
            .then(data => setIdforDelete(data.id))
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    if(requestMethod == 'DELETE'){
      try {
        await fetch(`${backendServer}api/userjob`, {
          method: requestMethod,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: userId,
            jobId: idForDelete,
          })
        })
      } catch (error) {
        console.error('Error:', error);
      }
    }

  };

  const sendLikeRequest = () => {
    const requestMethod = favorite ? 'DELETE' : 'POST';
    const requestBody = {
      url: jobInfo.application_details.url,
      jobTechId: jobInfo.id,
      jobText: jobInfo.description.text,
      selectedSkillIds: [],
    };
    likeRequest(requestMethod, requestBody);
    setFavorite(!favorite);
  };

  const navigate = useNavigate();
  const handleMatching = () => {
    navigate('matches', { state: jobInfo });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{ minWidth: 30, marginBlock: 2, paddingInline: 5, borderRadius: 6 }}
    >
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
          {Object.values(jobInfo.must_have).some(arr => arr.length > 0) && (
            <Typography>Must have: </Typography>
          )}
          {Object.entries(jobInfo.must_have).map(
            ([key, values]) =>
              values.length > 0 && (
                <Typography key={key}>
                  <strong>{key.replace('_', ' ')}:</strong>{' '}
                  {values.map(item => item.label).join(', ')}
                </Typography>
              )
          )}
        </div>
        <div>
          {Object.values(jobInfo.nice_to_have).some(arr => arr.length > 0) && (
            <p>Nice to have: </p>
          )}
          {Object.entries(jobInfo.nice_to_have).map(
            ([key, values]) =>
              values.length > 0 && (
                <p key={key}>
                  <strong>{key}:</strong>{' '}
                  {values.map(item => item.label).join(', ')}
                </p>
              )
          )}
        </div>
      </CardContent>

      <CardActions disableSpacing sx={{ paddingBottom: 3 }}>
        {isAuthenticated &&
          <IconButton aria-label="add to favorites" onClick={sendLikeRequest}>
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        }
        <Button size="small" variant="outlined" onClick={handleMatching}>
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
              __html: jobInfo.description.text_formatted,
            }}
          ></div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default JobCard;
