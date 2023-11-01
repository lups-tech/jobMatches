import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@mui/base';
import { FormHelperText, Snackbar, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { DevFormSchema } from '../types/validationTypes';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { postDeveloperRequest } from '../utils/mutationTools';

const DevForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sendError, setSendError] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();
  const { control, handleSubmit } = useForm<z.infer<typeof DevFormSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(DevFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (data: z.infer<typeof DevFormSchema>) => {
    setLoading(true);
    try {
      const res = await postDeveloperRequest({ data, getAccessTokenSilently });
      navigate(`${res.id}/skills`, { state: res });
    } catch (error) {
      setSendError(true);
      setTimeout(() => setSendError(false), 2000);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 mx-auto min-w-fit max-w-xl px-4 w-1/3"
      >
        <Typography variant="h6" className="mb-10 md:pb-12">
          Add a Developer
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({
            field: { value, onChange, onBlur, ref },
            fieldState: { error },
          }) => (
            <FormControl>
              <TextField
                className="w-96 lg:max-w-md"
                name="name"
                label="Name"
                required
                placeholder="John Doe"
                inputRef={ref}
                value={value}
                onChange={onChange}
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
                className="w-96 lg:max-w-md"
                name="email"
                label="Email"
                placeholder="developer@email.com"
                required
                inputRef={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={Boolean(error)}
              />
              <FormHelperText sx={{ color: 'error.main' }}>
                {error?.message ?? ''}
              </FormHelperText>
            </FormControl>
          )}
        />
        <LoadingButton
          loading={loading}
          variant="contained"
          type="submit"
          className="w-[60%] max-w-xs"
        >
          Create Developer
        </LoadingButton>
      </form>
      <Snackbar
        open={sendError}
        autoHideDuration={3000}
        message="Loading failed, please try again"
        ContentProps={{ sx: { backgroundColor: '#ff3030' } }}
      />
    </div>
  );
};

export default DevForm;
