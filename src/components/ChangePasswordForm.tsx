import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/base';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Divider,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch } from 'react';

const backendServer = import.meta.env.VITE_BE_SERVER;

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty()
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one digit',
      )
      .refine(
        (password) => /[\W_]/.test(password),
        'Password must contain at least one special character',
      ),
    confirmPassword: z
      .string()
      .nonempty()
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one digit',
      )
      .refine(
        (password) => /[\W_]/.test(password),
        'Password must contain at least one special character',
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Please ensure passwords match',
    path: ['confirmPassword'],
  });

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
      await axios.patch(
        `${backendServer}api/users/editpassword`,
        { password: data.newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
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
