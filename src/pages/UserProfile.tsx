import { useAuth0 } from '@auth0/auth0-react';
import {
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';

type editedUserInfo = {
  name?: string;
  email?: string;
};
const UserProfile: React.FC = () => {
  const {
    user: userInfo,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState<editedUserInfo>({
    name: '',
    email: '',
  });

  // const handleFocus = () => {
  //   setEditedUserInfo({ ...editedUserInfo, name: '', email: '' });
  // };
  const handleFocus = (e: any) => {
    const inputElement = e.target;
    inputElement.setSelectionRange(0, inputElement.value.length);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUserInfo({ name: userInfo?.nickname, email: userInfo?.email });
  };
  const handleSave = () => {
    // patch request??
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  console.log(userInfo);
  if (isUserLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="flex justify-center">
        <div className="max-w-[800px] mx-10">
          {userInfo?.picture === undefined ? (
            <Avatar sx={{ width: 56, height: 56 }}>T</Avatar>
          ) : (
            <Avatar
              alt="Profie pic"
              src={userInfo.picture}
              sx={{ width: 56, height: 56 }}
            />
          )}
          {isEditing ? (
            <div>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                onFocus={handleFocus}
                value={editedUserInfo.name}
                onChange={(e) =>
                  setEditedUserInfo({ ...editedUserInfo, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                onFocus={handleFocus}
                value={editedUserInfo.email}
                onChange={(e) =>
                  setEditedUserInfo({
                    ...editedUserInfo,
                    email: e.target.value,
                  })
                }
              />
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <Typography variant="h5" gutterBottom>
                {userInfo?.nickname}
              </Typography>
              <Typography variant="body1">
                <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
                {userInfo?.email}
              </Typography>
              <Button variant="outlined" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default UserProfile;
