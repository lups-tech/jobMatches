import { CircularProgress, Divider, TextField, Autocomplete, Button, FormHelperText, FormControl } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { Auth0User } from "../../../types/innerTypes";
import { UpgradeUser, fetchAuth0Users} from "../../../utils/fetchingTools";
import { useState } from "react";


const UpgradeUserForm = ({ getAccessTokenSilently, setSendSuccess, setSendError } 
    : { 
        getAccessTokenSilently: () => Promise<string>,
        setSendSuccess : React.Dispatch<React.SetStateAction<boolean>>,
        setSendError : React.Dispatch<React.SetStateAction<boolean>>, 
    }) => {
    const [currentSales, setCurrentSales] = useState<Auth0User | null>();
    const [ emptySales, setEmptySales ] = useState<boolean>(false);
    
    const {
        isLoading: isSalesInfoLoading,
        error: isSalesInfoError,
        data: SalesInfo,
        refetch: refetchSalesInfo,
        } = useQuery<Auth0User[], Error>({
        queryKey: ['Auth0SalesInfo'],
        queryFn: async () => {
            const accessToken = await getAccessTokenSilently();
            return fetchAuth0Users(accessToken);
        },
    });

    const handleSubmit = async () => {
        if(currentSales == null){
            setEmptySales(true);
            setTimeout(() => setEmptySales(false), 3000);
            return;
        }
        const accessToken = await getAccessTokenSilently();
        try {
            await UpgradeUser(currentSales!.auth0Id, accessToken);
            setSendSuccess(true);
            setTimeout(() => setSendSuccess(false), 3000);
            refetchSalesInfo();
        } catch (error) {
            setSendError(true);
            setTimeout(() => setSendError(false), 3000);
        }
    }

    

    if (isSalesInfoLoading) {
        return (
          <div className="flex justify-center mt-16">
            <CircularProgress />
          </div>
        );
    }
    
    if (isSalesInfoError) {
    console.log('❗️error: ', isSalesInfoError);
    return (
        <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
        </div>
    );
    }

    return (
        <div className="flex flex-col gap-3 min-w-[400px] my-3">
            <Divider sx={{marginBottom: "1rem"}}>Upgrade Existing User to Admin</Divider>
            <FormControl>
                <Autocomplete
                    sx={{borderRadius: '24px'}}
                    id="Auth0Sales"
                    options={SalesInfo}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={`Select a User`}
                        />
                    )}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    onChange={(_event, value) => {
                        setCurrentSales(value)
                    }}
                />
                <FormHelperText 
                    sx={{ color: '#ff3030' }}>
                    {emptySales ? 'Please select a user' : ''}
                </FormHelperText>
            </FormControl>
            <Button variant="contained" onClick={handleSubmit}>
                Upgrade Selected User
            </Button>
        </div>
    ) 
}

export default UpgradeUserForm