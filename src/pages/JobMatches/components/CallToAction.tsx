import { Paper, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <Paper
          elevation={1}
          sx={{
            padding: 2,
            marginBottom: 2,
            borderRadius: 6,
            // Following logic is to color the dev card based on the first Programming Language they have
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" sx={{marginBottom: "1rem"}}>Log in to Match Real Developers</Typography>
          <Typography variant="body1">
            {"Contact us at "}
            <Link 
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            to="mailto:lups.talenthub.tech@gmail.com">lups.talenthub.tech@gmail.com 
            </Link> 
            {" to set up an organization"}</Typography>
    </Paper>
  )
}

export default CallToAction