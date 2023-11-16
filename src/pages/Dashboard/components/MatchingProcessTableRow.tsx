import {
  IconButton,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material';
import { MatchingProcess, UserInfoDTO } from '../../../types/innerTypes';
import { deleteMatchingProcessRequest } from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import { InterviewCells } from './InterviewCells';
import ContractSelector from './ContractSelector';
import { ProposedCell } from './ProposedCell';

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

  const deleteMatchingProcessMutation = useMutation(
    deleteMatchingProcessRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['matchingProcess']);
      },
    }
  );

  const removeMatchingProcessHandle = (processId: string) => {
    deleteMatchingProcessMutation.mutate({ processId, getAccessTokenSilently });
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
          <ProposedCell process={process} />
        </StyledTableCell>
        <StyledTableCell align="right">
          <InterviewCells process={process} />
        </StyledTableCell>
        <StyledTableCell align="right">
          <ContractSelector process={process} />
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.placed ? 'Yes' : 'No'}
        </StyledTableCell>
        <StyledTableCell>
          <IconButton
            aria-label="Delete"
            onClick={() => removeMatchingProcessHandle(process.id)}
          >
            <DeleteIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
