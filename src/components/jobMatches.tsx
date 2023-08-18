import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Matches } from '../types/scraperTypes';
import { Job } from '../types/jobTechApiTypes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';

const backendServer = import.meta.env.VITE_BE_SERVER

type LocationState = {
  state: Job;
};

const fetchMatches = async (job: Job) => {
  const jobDescription = { description: job.description.text }
  const res = await axios.post(`${backendServer}scraper`, jobDescription);
  return res.data;
};

const JobMatches = () => {
  const { state: jobInfo } = useLocation() as LocationState;
  const {
    isLoading,
    error,
    data: matches,
  } = useQuery<Matches, Error>({
    queryKey: ['developers'],
    queryFn: () => fetchMatches(jobInfo),
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-start">
      <div className="flex flex-col gap-5">
        <Accordion
          defaultExpanded
          elevation={1}
          sx={{ maxWidth: 700, padding: 4 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="job-content"
            id="job-header"
          >
            <div>
              <Typography variant="h3">{jobInfo.headline}</Typography>
              <Typography variant="h6">{jobInfo.employer.name}</Typography>
            {jobInfo.application_details.url && (
              <Button variant="outlined" sx={{ marginTop: 2 }} onClick={() => window.open(jobInfo.application_details.url)}>
                Click here to apply
              </Button>
            )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div
              dangerouslySetInnerHTML={{
                __html: jobInfo.description.text_formatted,
              }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Button variant="contained">Save Job</Button>
      </div>
      <div className="max-w-md flex-grow">
        <Typography variant="h2">Best Matches</Typography>
        {matches.developers.map((dev) => (
          <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }} key={dev.id}>
            <Typography variant="h5">{dev.name}</Typography>
            <Typography variant="body1"><EmailIcon fontSize='small' sx={{marginRight: 1}}/>{dev.email}</Typography>
            <Stack spacing={1} direction="row">
              {dev.skills
                .filter((skill) =>
                  matches.jobSkills.some((jobSkill) => jobSkill.id === skill.id)
                )
                .map((skill) => (
                  <Chip label={skill.title} size="small" key={skill.id} />
                ))}
            </Stack>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default JobMatches;
