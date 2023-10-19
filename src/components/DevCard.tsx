import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Typography,
  IconButton,
  IconButtonProps,
  styled,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmailIcon from '@mui/icons-material/Email';
import { Developer, DeveloperDTO, Skill } from '../types/innerTypes';
import { cardColorLogic } from '../data/programmingLanguageColors';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglelikeRequest } from '../utils/fetchingTools';

interface ExpandMoreProps extends IconButtonProps {
  // the value is either 'true' or 'false', not using boolean type because it causes a fontend terminal error
  expand: string;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: expand != 'true' ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const DevCard = ({
  developer,
  isLiked,
}: {
  developer: Developer;
  isLiked: boolean;
  currentDevelopers?: DeveloperDTO[];
  setCurrentDevelopers?: React.Dispatch<React.SetStateAction<DeveloperDTO[]>>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(isLiked);
  const { getAccessTokenSilently, user } = useAuth0();
  const queryClient = useQueryClient();

  const mutation = useMutation(togglelikeRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']); // Invalidate and refetch the developers list
      setFavorite(!favorite);
    },
  });

  const handleLikeToggle = () => {
    const requestMethod = favorite ? 'DELETE' : 'PATCH';
    const requestBody = {
      userId: user?.sub ? user.sub : '',
      developerId: developer.id,
    };
    mutation.mutate({
      requestMethod,
      requestBody,
      endpointPath: 'api/userdeveloper',
      getAccessTokenSilently: getAccessTokenSilently,
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const groupSkillsByCategory = (skills: Skill[]) => {
    const groupedSkills: { [key: string]: string[] } = {};

    skills.forEach(skill => {
      if (!groupedSkills[skill.type]) {
        groupedSkills[skill.type] = [];
      }
      groupedSkills[skill.type].push(skill.title);
    });

    return groupedSkills;
  };

  const groupedSkills = groupSkillsByCategory(developer.skills);

  return (
    <Card
      sx={{
        marginBlock: 1,
        paddingInline: 5,
        display: 'flex',
        flexDirection: 'column',
        minWidth: '350px',
        borderRadius: 6,
        backgroundColor: `${
          groupedSkills['Programming Language']
            ? cardColorLogic[groupedSkills['Programming Language'][0]]
            : ''
        }`,
      }}
    >
      <CardHeader />
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={2}>
          {/* should change the src to a condition that if the user has his/her profile picture, if leave src empty, avatar component will show the character of user name */}
          <Avatar
            alt={developer.name}
            src={`https://i.pravatar.cc/300?img=${developer.id.slice(0, 1)}`}
            sx={{ width: 72, height: 72 }}
          />
        </Grid>
        <Grid item xs={10}>
          <CardContent
            style={{ marginTop: -10, marginBottom: -10, marginLeft: 10 }}
          >
            <Typography variant="h5" gutterBottom className="">
              {developer.name}
            </Typography>

            <div>
              {groupedSkills['Programming Language'] && (
                <Typography>
                  Programming Language:{' '}
                  <span className="font-bold">
                    {groupedSkills['Programming Language'].join(', ')}
                  </span>
                </Typography>
              )}
              {groupedSkills['Technical Skills'] && (
                <span className="font-bold flex">
                  {groupedSkills['Technical Skills'].map((skill, index) => {
                    const chipWidth = skill.length * 8 + 20;
                    return (
                      <div
                        key={index}
                        data-te-chip-init
                        data-te-ripple-init
                        className="[word-wrap: break-word] my-[5px] mr-4 flex h-[32px] items-center justify-center rounded-[16px] bg-[#f2efef] bg-opacity-70 px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none dark:bg-neutral-600 dark:text-neutral-200"
                        style={{ width: `${chipWidth}px` }}
                        data-te-close="true"
                      >
                        {skill}
                      </div>
                    );
                  })}
                </span>
              )}
              {groupedSkills['Prior Experience'] && (
                <Typography>
                  Prior Experience:{' '}
                  <span className="font-bold">
                    {groupedSkills['Prior Experience'].join(', ')}
                  </span>
                </Typography>
              )}
              {groupedSkills['Speaking Languages'] && (
                <Typography gutterBottom>
                  Speaking Languages:{' '}
                  <span className="font-bold">
                    {groupedSkills['Speaking Languages'].join(', ')}
                  </span>
                </Typography>
              )}
            </div>
          </CardContent>
        </Grid>
      </Grid>

      <CardActions
        disableSpacing
        sx={{ paddingBottom: 3, marginY: 2, height: 30 }}
      >
        <IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <ExpandMore
          expand={expanded.toString()}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          style={{ maxHeight: '100%', width: '100%', marginTop: -10 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
              overflowY: 'auto',
            }}
          >
            <div>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body1" style={{ maxWidth: '400px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                dapibus ante sit amet dolor tincidunt, non rutrum nibh rhoncus.
                Aliquam at ex tellus. Nullam a dolor purus. Pellentesque vitae
                ante ac felis congue congue tristique ac neque. Class aptent
                taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos.
              </Typography>
              <div className="my-2">
                <Divider />
              </div>
              <Typography variant="body1">
                <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
                <span className="font-bold">{developer.email}</span>
              </Typography>
            </div>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DevCard;
