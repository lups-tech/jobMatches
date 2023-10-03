import { IconButton, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const UserProfileButton = () => {
  const navigate = useNavigate();
  return (
    <Tooltip title="Profile">
      <IconButton
        aria-label="user profile"
        color="info"
        onClick={() => navigate('/userprofile/:id')}
      >
        <PersonIcon />
      </IconButton>
    </Tooltip>
  );
};

export default UserProfileButton;
