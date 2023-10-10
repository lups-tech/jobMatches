import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { TeamMemberInfo } from '../types/innerTypes';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import IconButton from '@mui/material/IconButton';

type Props = {
  memberInfo: TeamMemberInfo;
};

const TeamMember = ({ memberInfo }: Props) => {
  const { imgUrl, memberName, memberDescription, githubLink, linkedinLink } =
    memberInfo;
  return (
    <Card
      sx={{
        borderRadius: 6,
        height: 300,
        width: 300,
        padding: 1,
      }}
    >
      <CardMedia
        sx={{
          height: 200,
          borderRadius: 4,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
        image={imgUrl}
        // style={{ backgroundPosition: 'center top' }}
      />
      <CardContent sx={{ marginInline: -0.5, marginTop: -0.5 }}>
        <div className="flex flex-row justify-between content-center">
          <Typography variant="h6">{memberName}</Typography>
          <div className="flex flex-row">
            {memberInfo.githubLink.length > 0 && (
              <IconButton
                color="primary"
                onClick={() => window.open(githubLink)}
                sx={{ margin: -0.5 }}
              >
                <GitHubIcon />
              </IconButton>
            )}
            {memberInfo.linkedinLink.length > 0 && (
              <IconButton
                color="primary"
                onClick={() => window.open(linkedinLink)}
                sx={{ margin: -0.5 }}
              >
                <LinkedInIcon />
              </IconButton>
            )}
          </div>
        </div>

        <Typography variant="body2" color="text.secondary">
          {memberDescription}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
