import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@mui/base";
import { FormHelperText, Snackbar, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { DevFormSchema } from "../types/validationTypes";
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const backendServer = import.meta.env.VITE_BE_SERVER


export default function DevForm(){
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

  const mutation = useMutation(
    async(postData : z.infer<typeof DevFormSchema>) => {
      const response = await axios.post(`${backendServer}api/developers`, postData);
      if(response.status != 201){
        throw new Error("201 error")
      }
      return response.data;
    }
  )
  //const navigate = useNavigate();
  const onSubmit = async (data: z.infer<typeof DevFormSchema>) => {
    mutation.mutateAsync(data);
    // if(res.status == 201){
    //   navigate('devs/skills', { state: res.data })
    // } else {
    //   setSendError(true)
    //   setTimeout(() => setSendError(false), 2000)
    //   setLoading(false)
    // }
    if(mutation.isLoading){
      setLoading(true)
    }
    if(mutation.isError){
      setSendError(true)
      setTimeout(() => setSendError(false), 2000)
      setLoading(false)
    }
    if(mutation.isSuccess){
      
    }
  }

  return (
      <>
        <form 
        noValidate 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col items-center gap-4 mx-auto min-w-fit max-w-xl px-4">
          <Typography variant="h4" className="mb-4">Add a Developer</Typography>
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
          <LoadingButton loading={loading} variant="outlined" type="submit" className="w-[60%] max-w-xs">Now add Skills</LoadingButton>
        </form>
        <Snackbar open={sendError} autoHideDuration={3000} message="Loading failed, please try again"/>
      </>
    )
}