import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Interview, MatchingProcess } from '../../../types/innerTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchInterviewRequest } from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';

interface InterviewCellProps {
  interview: Interview;
  process: MatchingProcess;
}

export const InterviewCell = ({ interview, process }: InterviewCellProps) => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();
  const interviewResultMutation = useMutation(patchInterviewRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const interviewSuccessedHandle = (interviewResult: boolean) => {
    console.log('sending interview successed request');
    const updatedInterview = { ...interview, passed: interviewResult };
    interviewResultMutation.mutate({
      updatedInterview,
      process,
      getAccessTokenSilently,
    });
  };

  return (
    <div className="flex flex-row justify-between">
      <p>{interview.interviewType}</p>
      <span className="w-24">
        <CheckCircleIcon
          color="success"
          sx={interview.passed === true ? undefined : { color: '#bbbbbb' }}
          onClick={() => interviewSuccessedHandle(true)}
        />
        <CancelIcon
          color="error"
          sx={interview.passed === false ? undefined : { color: '#bbbbbb' }}
          onClick={() => interviewSuccessedHandle(false)}
        />
        <CalendarMonthIcon sx={{ color: '#bbbbbb' }} />
      </span>
    </div>
  );
};
