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
import {
  checkIfAJobIsExisted,
  togglelikeRequest,
} from '../../../utils/fetchingTools';

const backendServer = import.meta.env.VITE_BE_SERVER;

const JobMatchesDevPaper = ({
  dev,
  matches,
  jobInfo,
  matched,
}: {
  dev: Developer;
  matches: Matches;
  jobInfo: Job;
  matched: boolean;
}) => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

  const mutationStartProcess = useMutation(postMatchingProcessRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const mutationLikeDeveloper = useMutation(togglelikeRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']); // Invalidate and refetch the developers list
    },
  });

  const startProcessHandle = async () => {
    const accessToken = await getAccessTokenSilently();

    const existingJob = await checkIfAJobIsExisted(accessToken, jobInfo.id);

    if (existingJob) {
      mutationStartProcess.mutate({
        data: { developerId: dev.id, jobId: existingJob.id },
        getAccessTokenSilently,
      });
      await fetch(`${backendServer}api/userjob`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user?.sub ? user.sub : '',
          jobId: existingJob.id,
        }),
      });
    } else {
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

      mutationStartProcess.mutate({
        data: { developerId: dev.id, jobId: newJob.id },
        getAccessTokenSilently,
      });
      await fetch(`${backendServer}api/userjob`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user?.sub ? user.sub : '',
          jobId: newJob.id,
        }),
      });
    }

    const requestBody = {
      userId: user?.sub ? user.sub : '',
      developerId: dev.id,
    };
    mutationLikeDeveloper.mutate({
      requestMethod: 'PATCH',
      requestBody,
      endpointPath: 'api/userdeveloper',
      getAccessTokenSilently: getAccessTokenSilently,
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
        {isAuthenticated && (
          <Button
            className="h-[40px] w-[170px]"
            onClick={startProcessHandle}
            disabled={matched}
          >
            {matched ? 'In Process' : 'Start Process'}
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default JobMatchesDevPaper;
