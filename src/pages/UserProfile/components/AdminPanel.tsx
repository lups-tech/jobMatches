import { Divider, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { AddUserForm } from "./AddUserForm";
import UpgradeUserForm from "./UpgradeUserForm";

export const AdminPanel = ({ name, getAccessTokenSilently } : {name: string, getAccessTokenSilently: () => Promise<string>}) => {
    const [sendUserSuccess, setUserSendSuccess] = useState<boolean>(false);
    const [sendError, setSendError] = useState<boolean>(false);
    const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false);
   
    return (
        <>
            <Divider sx={{marginTop: '2rem'}}>Organization Options</Divider>
            <div className="mt-6 flex-col gap-2">
                <Paper sx={{padding : '2rem', marginBottom: '1rem', borderRadius: 6,}}>
                    <AddUserForm 
                        name={name} 
                        getAccessTokenSilently={getAccessTokenSilently} 
                        setSendSuccess={setUserSendSuccess} 
                        setSendError={setSendError} 
                    />
                </Paper>
                <Paper sx={{padding : '2rem', marginBlock: '1rem', borderRadius: 6,}}>
                    <UpgradeUserForm  
                        getAccessTokenSilently={getAccessTokenSilently} 
                        setSendSuccess={setUpgradeSuccess} 
                        setSendError={setSendError} 
                    />
                </Paper>
            </div>
            <Snackbar
            open={sendUserSuccess}
            autoHideDuration={3000}
            message="Invitation Sent"
            ContentProps={{ sx: { backgroundColor: '#54ac68' } }}
            />
            <Snackbar
            open={upgradeSuccess}
            autoHideDuration={3000}
            message="User Upgraded"
            ContentProps={{ sx: { backgroundColor: '#54ac68' } }}
            />
            <Snackbar
                open={sendError}
                autoHideDuration={3000}
                message="There has been a problem, please try again"
                ContentProps={{ sx: { backgroundColor: '#ff3030' } }}
            />
        </>
    )
}
