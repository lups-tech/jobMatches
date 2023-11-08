import { Button, Paper, Typography, Stack, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { cardColorLogic } from '../../../data/programmingLanguageColors';
import { Developer, JobDTO } from '../../../types/innerTypes';
import { Matches } from '../../../types/scraperTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  postJobRequest,
  postMatchingProcessRequest,
} from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { Job } from '../../../types/jobTechApiTypes';

const JobMatchesDevPaper = ({
  dev,
  matches,
  jobInfo,
}: {
  dev: Developer;
  matches: Matches;
  jobInfo: Job;
}) => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  const mutationStartProcess = useMutation(postMatchingProcessRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });
  const startProcessHandle = async () => {
    console.log('started');
    // checkIfAJobIsExisted() ? fetchJobId() : postJobRequest()

    // Get the job id from our database

    // Post the job to our database and get the job id
    const createJobReq = {
      jobTechId: jobInfo.id,
      url: jobInfo.application_details.url,
      title: jobInfo.headline,
      deadline: jobInfo.application_deadline,
      employer: jobInfo.employer.name,
      jobText: jobInfo.description.text,
      SelectedSkillIds: matches.jobSkills.map(jobSkill => jobSkill.id),
    };
    const newJob = (await postJobRequest({
      createJobReq,
      getAccessTokenSilently,
    })) as JobDTO;

    // post a new MatchingProcess object
    mutationStartProcess.mutate({
      data: { developerId: dev.id, jobId: newJob.id },
      getAccessTokenSilently,
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        padding: 2,
        marginBottom: 2,
        borderRadius: 6,
        width: 440,
        // Following logic is to color the dev card based on the first Programming Language they have
        backgroundColor: `${
          cardColorLogic[
            dev.skills.filter(skill => skill.type === 'Programming Language')
              .length > 0
              ? dev.skills.filter(
                  skill => skill.type === 'Programming Language'
                )[0].title
              : 'no_such_programming_skill'
          ]
        }`,
      }}
      key={dev.id}
    >
      <div className="flex justify-between">
        <div>
          <Typography variant="h5">{dev.name}</Typography>
          <Typography variant="body1">
            <EmailIcon fontSize="small" sx={{ marginRight: 1 }} />
            {dev.email}
          </Typography>
          <Stack spacing={1} direction="row">
            {dev.skills
              .filter(skill =>
                matches.jobSkills.some(jobSkill => jobSkill.id === skill.id)
              )
              .map(skill => (
                <Chip label={skill.title} size="small" key={skill.id} />
              ))}
          </Stack>
        </div>
        <Button className="h-[40px] w-[170px]" onClick={startProcessHandle}>
          Start Process
        </Button>
      </div>
    </Paper>
  );
};

export default JobMatchesDevPaper;
