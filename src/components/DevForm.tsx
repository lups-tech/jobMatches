import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl } from "@mui/base";
import { Button, FormHelperText, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { DevFormSchema } from "../types/validationTypes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendServer = import.meta.env.VITE_BE_SERVER

export default function DevForm(){
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
    const res = await axios.post(`${backendServer}api/developers`, data);
    if(res.status == 201){
      navigate('devs/skills', { state: res.data })
    }
    
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
      <Button type="submit">Add Skills</Button>
    </form>
    )
}