import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserProfileButton = () => {
    const navigate = useNavigate();
    return (
        <Button variant="contained" onClick={()=>navigate('/userprofile/:id')}>
          My profile
        </Button>
      );
  
}

export default UserProfileButton;