import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { TeamMemberInfo } from '../types/innerTypes';

type Props = {
  memberInfo: TeamMemberInfo;
};

const TeamMember = ({ memberInfo }: Props) => {
  const { imgUrl, memberName, memberDescription, githubLink, linkedinLink } =
    memberInfo;
  return (
    <Card sx={{ borderRadius: 6, height: 300, width: 300, padding: 2 }}>
      <CardMedia sx={{ height: 128, borderRadius: 5 }} image={imgUrl} />
      <CardContent>
        <Typography variant="h5">{memberName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {memberDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => window.open(githubLink)}>
          GitHub
        </Button>
        <Button size="small" onClick={() => window.open(linkedinLink)}>
          LinkedIn
        </Button>
      </CardActions>
    </Card>
  );
};

export default TeamMember;
