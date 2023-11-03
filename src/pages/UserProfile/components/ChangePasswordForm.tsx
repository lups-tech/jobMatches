import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/base';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Button, Divider, FormHelperText, TextField } from '@mui/material';
import { Dispatch } from 'react';
import { passwordSchema } from '../../../types/validationTypes';
import { editPassword } from '../../../utils/mutationTools';

const ChangePasswordForm = ({
  success,
  passwordError,
}: {
  success: Dispatch<React.SetStateAction<boolean>>;
  passwordError: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { control, handleSubmit } = useForm<z.infer<typeof passwordSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSave = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const accessToken = await getAccessTokenSilently();
      editPassword(data.newPassword, accessToken);
      success(true);
      setTimeout(() => success(false), 3000);
    } catch (error) {
      passwordError(true);
      setTimeout(() => passwordError(false), 3000);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleSave)}
      className="flex flex-col gap-3 min-w-[400px]"
    >
      <Divider>Change Password</Divider>
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
      <div className="flex w-full justify-around">
        <Button variant="contained" type="submit">
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
