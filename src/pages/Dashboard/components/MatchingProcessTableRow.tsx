import {
  Checkbox,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material';
import {
  MatchingProcess,
  Proposed,
  UserInfoDTO,
} from '../../../types/innerTypes';
import { InterviewCell } from './InterviewCell';
import { patchProposedRequest } from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

  const succeededHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.checked;
    if (result) {
      proposedMutation.mutate({ result, process, getAccessTokenSilently });
      // console.log('send success request');
    } else {
      console.log('send cancel success request');
    }
  };

  const displayProposed = (proposed: Proposed) => {
    if (proposed) {
      if (proposed.succeeded) {
        return proposed.date.split('T')[0];
      }
      return 'Rejected';
    }
    return (
      <div>
        Succeeded
        <Checkbox color="success" onChange={e => succeededHandle(e)} />
        Rejected
        <Checkbox color="error" />
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
            {process.interviews.length > 0
              ? process.interviews.map(interview => (
                  <InterviewCell key={interview.id} interview={interview} />
                ))
              : 'No interview yet'}
          </div>
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.interviews.length > 0
            ? process.contracts.length
            : 'No Contracts yet'}
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.placed ? 'Yes' : 'No'}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
