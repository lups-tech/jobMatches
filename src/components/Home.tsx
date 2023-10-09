import { Stack, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <img src={logo} className="md:w-1/4 w-1/3 fill-{#3b82f6}" />
      <Stack direction="row" spacing={3}>
        <Button variant="outlined" onClick={() => navigate('/about-us')}>
          About TalentHub
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.open('https://github.com/lups-tech')}
        >
          <GitHubIcon sx={{ paddingRight: 1 }} />
          GitHub
        </Button>
      </Stack>
    </Stack>
  );
};

export default Home;
