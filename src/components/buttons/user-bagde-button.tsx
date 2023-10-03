import { User } from '@auth0/auth0-react';
import { Avatar, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
  user: User;
  loading: boolean;
};

const UserBadgeButton: React.FC<Props> = ({ user, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Chip
      avatar={
        user.picture === undefined ? (
          <Avatar>T</Avatar>
        ) : (
          <Avatar alt="Profie pic" src={user.picture} />
        )
      }
      label={user.name}
      onClick={() => navigate('/user-profile')}
    />
  );
};

export default UserBadgeButton;
