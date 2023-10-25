import { useAuth0 } from '@auth0/auth0-react';
import {
  Avatar,
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/base';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

const backendServer = import.meta.env.VITE_BE_SERVER;

const UserSchema = z
  .object({
    name: z.string().nonempty('Please specify an name'),
    nickname: z.string().nonempty('Please specify a username').max(10),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Please ensure passwords match',
    path: ['confirmPassword'],
  });

const UserProfile: React.FC = () => {
  const {
    user: userInfo,
    isLoading: isUserLoading,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: userInfo?.name,
    nickname: userInfo?.nickname,
  });

  const { control, handleSubmit } = useForm<z.infer<typeof UserSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: userInfo?.name,
      nickname: userInfo?.nickname,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (data: z.infer<typeof UserSchema>) => {
    try {
      const body = {
        name: data.name,
        nickname: data.nickname,
      };

      const accessToken = await getAccessTokenSilently();
      await axios.patch(`${backendServer}api/users/edit`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(body);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
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
            <form
              noValidate
              onSubmit={handleSubmit(handleSave)}
              className="flex flex-col gap-3 min-w-[400px]"
            >
              <Controller
                name="name"
                control={control}
                render={({
                  field: { value, onChange, onBlur, ref },
                  fieldState: { error },
                }) => (
                  <FormControl>
                    <TextField
                      name="name"
                      label="Name"
                      variant="outlined"
                      fullWidth
                      onChange={onChange}
                      value={value}
                      inputRef={ref}
                      onBlur={onBlur}
                      error={Boolean(error)}
                    />
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {error?.message ?? ''}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="nickname"
                control={control}
                render={({
                  field: { value, onChange, onBlur, ref },
                  fieldState: { error },
                }) => (
                  <FormControl>
                    <TextField
                      name="nickname"
                      label="Username"
                      variant="outlined"
                      fullWidth
                      onChange={onChange}
                      value={value}
                      inputRef={ref}
                      onBlur={onBlur}
                      error={Boolean(error)}
                    />
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {error?.message ?? ''}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <div>
                <Typography>Change Password</Typography>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({
                    field: { value, onChange, onBlur, ref },
                    fieldState: { error },
                  }) => (
                    <FormControl>
                      <TextField
                        name="newPassword"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        onChange={onChange}
                        value={value}
                        inputRef={ref}
                        onBlur={onBlur}
                        error={Boolean(error)}
                      />
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {error?.message ?? ''}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({
                    field: { value, onChange, onBlur, ref },
                    fieldState: { error },
                  }) => (
                    <FormControl>
                      <TextField
                        name="confirmPassword"
                        label="Confirm New Password"
                        variant="outlined"
                        fullWidth
                        onChange={onChange}
                        value={value}
                        type="password"
                        inputRef={ref}
                        onBlur={onBlur}
                        error={Boolean(error)}
                      />
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {error?.message ?? ''}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </div>
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </form>
          ) : (
            <div>
              <Typography variant="h5" gutterBottom>
                {currentUser.name}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {currentUser.nickname}
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
