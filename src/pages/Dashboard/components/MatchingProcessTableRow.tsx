import {
  Checkbox,
  IconButton,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
  Typography,
} from '@mui/material';
import {
  MatchingProcess,
  Proposed,
  UserInfoDTO,
} from '../../../types/innerTypes';
import { InterviewCell } from './InterviewCell';
import {
  patchProposedRequest,
  deleteMatchingProcessRequest,
  patchInterviewRequest,
} from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface MatchingProcessTableRow {
  process: MatchingProcess;
  userInfo: UserInfoDTO;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const MatchingProcessTableRow = ({
  process,
  userInfo,
}: MatchingProcessTableRow) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const proposedMutation = useMutation(patchProposedRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });
  const deleteMatchingProcessMutation = useMutation(
    deleteMatchingProcessRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['matchingProcess']);
      },
    }
  );
  const interviewMutation = useMutation(patchInterviewRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const proposedHandle = (result: boolean) => {
    proposedMutation.mutate({ result, process, getAccessTokenSilently });
  };

  const removeMatchingProcessHandle = (processId: string) => {
    deleteMatchingProcessMutation.mutate({ processId, getAccessTokenSilently });
  };

  const addInterviewHandle = (process: MatchingProcess) => {
    interviewMutation.mutate({
      interviewType: 'Personal',
      process,
      getAccessTokenSilently,
    });
  };

  const displayProposed = (proposed: Proposed) => {
    if (proposed) {
      return (
        <Typography
          variant="body1"
          sx={
            proposed.succeeded
              ? { color: '#8baf73', fontWeight: 'bold' }
              : { color: '#c77071', fontWeight: 'bold' }
          }
        >
          {proposed.date.split('T')[0]}
        </Typography>
      );
    }
    return (
      <div>
        Succeeded
        <Checkbox color="success" onChange={() => proposedHandle(true)} />
        Rejected
        <Checkbox color="error" onChange={() => proposedHandle(false)} />
      </div>
    );
  };

  return (
    <>
      <StyledTableRow key={process.id}>
        <StyledTableCell component="th" scope="row">
          {
            userInfo.developers.find(
              developer => developer.id === process.developerId
            )?.name
          }
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {userInfo.jobs.find(job => job.id === process.jobId)?.employer}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {userInfo.jobs.find(job => job.id === process.jobId)?.title}
        </StyledTableCell>
        <StyledTableCell align="right">
          {displayProposed(process.proposed)}
        </StyledTableCell>
        <StyledTableCell align="right">
          <div>
            {process.interviews.length > 0 ? (
              process.interviews.map(interview => (
                <InterviewCell key={interview.id} interview={interview} />
              ))
            ) : (
              <IconButton aria-label="Delete">
                <AddCircleOutlineIcon
                  onClick={() => addInterviewHandle(process)}
                />
              </IconButton>
            )}
          </div>
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.interviews.length > 0
            ? process.contracts.length
            : 'No contracts yet'}
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.placed ? 'Yes' : 'No'}
        </StyledTableCell>
        <StyledTableCell>
          <IconButton aria-label="Delete">
            <DeleteIcon
              onClick={() => removeMatchingProcessHandle(process.id)}
            />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
