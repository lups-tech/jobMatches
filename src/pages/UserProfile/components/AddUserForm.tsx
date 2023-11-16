import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AddUserSchema } from "../../../types/validationTypes";
import {FormControl, Divider, TextField, FormHelperText, Button } from "@mui/material";
import { InviteUser } from "../../../utils/fetchingTools";

export const AddUserForm = ({ name, getAccessTokenSilently, setSendSuccess, setSendError } 
    : {
        name: string, 
        getAccessTokenSilently: () => Promise<string>,
        setSendSuccess : React.Dispatch<React.SetStateAction<boolean>>,
        setSendError : React.Dispatch<React.SetStateAction<boolean>>, 
    }) => {

    const { control, handleSubmit } = useForm<z.infer<typeof AddUserSchema>>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        resolver: zodResolver(AddUserSchema),
        defaultValues: {
          email: "",
        },
    });

    const handleSave = async ( {email} : z.infer<typeof AddUserSchema>) => {
        const accessToken = await getAccessTokenSilently();
        try{
            await InviteUser(email, name, accessToken);
            setSendSuccess(true);
            setTimeout(() => setSendSuccess(false), 3000);
        } catch (error) {
            setSendError(true);
            setTimeout(() => setSendError(false), 3000);
        }
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleSave)}
            className="flex flex-col gap-3 min-w-[400px] my-3"
        >
            <Divider sx={{marginBottom: "1rem"}}>Invite a New User</Divider>
            <Controller
            name="email"
            control={control}
            render={({
                field: { value, onChange, onBlur, ref },
                fieldState: { error },
            }) => (
                <FormControl>
                <TextField
                    sx={{borderRadius: '24px'}}
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
            <Button variant="contained" type="submit">
                Invite to your Organization
            </Button>
        </form>
  )
}
