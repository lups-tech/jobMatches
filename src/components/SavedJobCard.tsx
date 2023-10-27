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
// import { Job } from '../types/externalTypes';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { togglelikeRequest } from '../utils/fetchingTools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JobDTO, Skill } from '../types/innerTypes';

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

const JobCard = ({
  jobInfo,
  isLiked,
  databaseId,
  userId,
  allSkills,
}: {
  jobInfo: JobDTO;
  isLiked: boolean;
  databaseId: string;
  userId: string;
  allSkills: Skill[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(isLiked);
  const [idForDelete, setIdforDelete] = useState(databaseId);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const queryClient = useQueryClient();

  const findMatchingSkills = (job: JobDTO) => {
    const jobDescriptionStrArr = {
      description: job.jobText,
    }.description
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s#]/g, '')
      .split(' ');
    const matchingSkills = allSkills.filter((skill) =>
      jobDescriptionStrArr.includes(skill.title.toLowerCase()),
    );
    return matchingSkills;
  };
  const mutation = useMutation(togglelikeRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']); // Invalidate and refetch the developers list
    },
  });

  //handle post unnecessary-delete it later
  const handleLikeRequest = () => {
    const requestMethod = favorite ? 'DELETE' : 'POST';
    const requestBody =
      requestMethod === 'POST'
        ? {
            url: jobInfo.url,
            jobTechId: jobInfo.id,
            jobText: jobInfo.jobText,
            title: jobInfo.title,
            deadline: jobInfo.deadline,
            employer: jobInfo.employer,
            selectedSkillIds: findMatchingSkills(jobInfo).map(
              (skill) => skill.id,
            ),
          }
        : {
            userId: userId,
            jobId: idForDelete,
          };
    const endpointPath = requestMethod === 'POST' ? 'api/jobs' : 'api/userjob';
    mutation.mutate({
      requestMethod,
      requestBody,
      endpointPath,
      getAccessTokenSilently,
      setIdforDelete,
    });
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
      sx={{ minWidth: 30, marginBlock: 1, paddingInline: 5, borderRadius: 6 }}
    >
      <CardHeader />
      <CardContent
        style={{ marginTop: -10, marginBottom: -10, marginLeft: 10 }}
      >
        <Typography color="text.secondary" gutterBottom>
          Deadline: {jobInfo.deadline?.split('T')[0]}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {jobInfo.title}
        </Typography>
        <Typography gutterBottom>{jobInfo.employer}</Typography>
        {/* <Typography variant="h5" gutterBottom>
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
        </div> */}
      </CardContent>

      <CardActions disableSpacing sx={{ paddingBottom: 3 }}>
        {isAuthenticated && (
          <IconButton aria-label="add to favorites" onClick={handleLikeRequest}>
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
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
              __html: jobInfo.jobText,
            }}
          ></div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default JobCard;
