import { useAuth0 } from '@auth0/auth0-react';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/base';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { ChangePasswordForm, AdminPanel } from './components';
import { useQuery } from '@tanstack/react-query';
import { UserInfoDTO } from '../../types/innerTypes';
import { fetchUserInfo } from '../../utils/fetchingTools';

const backendServer = import.meta.env.VITE_BE_SERVER;

const UserSchema = z.object({
  name: z.string().nonempty('Please specify an name'),
  email: z.string().email().nonempty('Please specify an email'),
});

export const UserProfile: React.FC = () => {
  const {
    user: Auth0userInfo,
    isLoading: isUserLoading,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [sendError, setSendError] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState({
    name: Auth0userInfo?.name,
    email: Auth0userInfo?.email,
  });

  const { control, handleSubmit } = useForm<z.infer<typeof UserSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: Auth0userInfo?.name,
      email: Auth0userInfo?.email,
    },
  });
  
  const {
    isLoading: isUserInfoLoading,
    error: isUserInfoError,
    data: userInfo,
  } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (data: z.infer<typeof UserSchema>) => {
    try {
      const body = {
        name: data.name,
        email: data.email,
      };

      const accessToken = await getAccessTokenSilently();
      await axios.patch(`${backendServer}api/users/edit`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(body);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (error) {
      setSendError(true);
      setTimeout(() => setSendError(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isUserLoading || isUserInfoLoading) {
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );
  }

  if (isUserInfoError) {
    console.log('❗️error: ', isUserInfoError);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="flex justify-center">
        <div className="max-w-[800px] flex flex-col mx-10">
          {isEditing && (
            <Tooltip title="Close">
              <CloseIcon
                onClick={handleCancel}
                sx={{
                  alignSelf: 'end',
                  marginTop: '1rem',
                  cursor: 'pointer'
                }}
              />
            </Tooltip>
          )}
          <div className="flex w-full justify-center">
            {Auth0userInfo?.picture === undefined ? (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  marginTop: isEditing ? '-0.75' : '3rem',
                  marginBottom: '1.5rem',
                }}
              >
                T
              </Avatar>
            ) : (
              <Avatar
                alt="Profie pic"
                src={Auth0userInfo.picture}
                sx={{
                  width: 90,
                  height: 90,
                  marginTop: isEditing ? '-0.75rem' : '3rem',
                  marginBottom: '1.5rem',
                }}
              />
            )}
          </div>
          {isEditing ? (
            <>
              <form
                noValidate
                onSubmit={handleSubmit(handleSave)}
                className="flex flex-col gap-3 min-w-[400px] my-3"
              >
                <Divider>Personal Information</Divider>
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
                  name="email"
                  control={control}
                  render={({
                    field: { value, onChange, onBlur, ref },
                    fieldState: { error },
                  }) => (
                    <FormControl>
                      <TextField
                        name="email"
                        label="Email"
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
                <div className="flex w-full justify-center mb-3">
                  <Button variant="contained" type="submit">
                    Update Details
                  </Button>
                </div>
              </form>
              <ChangePasswordForm
                success={setPasswordSuccess}
                passwordError={setPasswordError}
              />
            </>
          ) : (
            <div className="flex flex-col gap-5 items">
              <Typography
                variant="h4"
                sx={{ alignSelf: 'center' }}
                gutterBottom
              >
                {currentUser.name}
              </Typography>
              <Divider>
                <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />{' '}
              </Divider>
              <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                {currentUser.email}
              </Typography>
              <Button variant="outlined" onClick={handleEdit}>
                Edit Details
              </Button>
            </div>
          )}
        {userInfo.isAdmin && <AdminPanel name={currentUser.name ?? ''} getAccessTokenSilently={getAccessTokenSilently} />}
        </div>
        <Snackbar
          open={sendSuccess}
          autoHideDuration={3000}
          message="Details successfully updated"
          ContentProps={{ sx: { backgroundColor: '#54ac68' } }}
        />
        <Snackbar
          open={sendError}
          autoHideDuration={3000}
          message="There has been a problem, please try again"
          ContentProps={{ sx: { backgroundColor: '#ff3030' } }}
        />
        <Snackbar
          open={passwordSuccess}
          autoHideDuration={3000}
          message="Password successfully changed"
          ContentProps={{ sx: { backgroundColor: '#54ac68' } }}
        />
        <Snackbar
          open={passwordError}
          autoHideDuration={3000}
          message="There has been a problem, please try again"
          ContentProps={{ sx: { backgroundColor: '#ff3030' } }}
        />
      </div>
    )
  );
};
