import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Matches } from '../../../types/scraperTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { UserInfoDTO } from '../../../types/innerTypes';
import { fetchUserInfo } from '../../../utils/fetchingTools';
import { Job } from '../../../types/jobTechApiTypes';
import { postJobRequest } from '../../../utils/mutationTools';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const JobMatchesJobPaper = ({
  jobInfo,
  matches,
}: {
  jobInfo: Job;
  matches: Matches;
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);

  const { data: userInfo } = useQuery<UserInfoDTO, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      if (isAuthenticated) {
        // await userCheck();
        const accessToken = await getAccessTokenSilently();
        return fetchUserInfo(accessToken, 'self');
      }
      return { jobs: [] };
    },
  });

  useEffect(() => {
    if (userInfo?.jobs.find(job => job.jobTechId === jobInfo.id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [userInfo]);

  const mutationLikeJob = useMutation(postJobRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries(['jobs']);
      setIsSaved(true);
    },
  });

  const saveJobHandle = async () => {
    const accessToken = await getAccessTokenSilently();
    if (matches) {
      const createJobReq = {
        jobTechId: jobInfo.id,
        url: jobInfo.application_details.url,
        title: jobInfo.headline,
        deadline: jobInfo.application_deadline,
        employer: jobInfo.employer.name,
        jobText: jobInfo.description.text,
        SelectedSkillIds: matches.jobSkills.map(jobSkill => jobSkill.id),
      };
      mutationLikeJob.mutate({ createJobReq, accessToken });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Accordion
        defaultExpanded
        square={true}
        elevation={1}
        sx={{
          maxWidth: 700,
          padding: 4,
          borderRadius: '24px',
        }}
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
              <Button
                variant="outlined"
                sx={{ marginTop: 2 }}
                onClick={() => window.open(jobInfo.application_details.url)}
              >
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
            style={{ all: 'inherit' }}
          ></div>
        </AccordionDetails>
      </Accordion>
      {!isSaved ? (
        <Button variant="contained" onClick={saveJobHandle}>
          Save Job
        </Button>
      ) : (
        <Button variant="contained" disabled>
          Saved
        </Button>
      )}
    </div>
  );
};

export default JobMatchesJobPaper;
