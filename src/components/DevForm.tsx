import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@mui/base";
import { FormHelperText, Snackbar, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { DevFormSchema } from "../types/validationTypes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import AllDevs from "./AllDevs";

const backendServer = import.meta.env.VITE_BE_SERVER;

const DevForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [sendError, setSendError] = useState<boolean>(false)
  const { control, handleSubmit } = useForm<z.infer<typeof DevFormSchema>>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(DevFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (data: z.infer<typeof DevFormSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendServer}api/developers`, data);
      navigate(`${res.data.id}/skills`, { state: res.data })
    } catch(error) {
      setSendError(true)
      setTimeout(() => setSendError(false), 2000)
      setLoading(false)
    }
  }

  return (
      <div className='flex justify-center'>
        <AllDevs />
        <form 
        noValidate 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col items-center gap-4 mx-auto min-w-fit max-w-xl px-4 w-1/3">
          <Typography variant="h4" className="mb-10 md:pb-12">Add a Developer</Typography>
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
              <FormHelperText sx={{color: 'error.main',}}>
                {error?.message ?? ""}
              </FormHelperText>
            </FormControl>
          )}/>
          <Controller
            name="email"
            control={control}
            render={({
              field: { value, onChange, onBlur, ref },
              fieldState: { error },}) => (
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
                <FormHelperText sx={{color: 'error.main',}}>
                  {error?.message ?? ""}
                </FormHelperText>
              </FormControl>
            )}/>
          <LoadingButton loading={loading} variant="outlined" type="submit" className="w-[60%] max-w-xs">Create Developer</LoadingButton>
        </form>
        <Snackbar open={sendError} autoHideDuration={3000} message="Loading failed, please try again"/>
      </div>
    )
}

export default DevForm