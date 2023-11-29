import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
  tableCellClasses,
  Typography,
} from '@mui/material';
import { mockMatchingProcesses } from '../../../data/mockMatchingProcesses';
import { MatchingProcess, UserInfoDTO } from '../../../types/innerTypes';
import { MatchingProcessTableRow } from './MatchingProcessTableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

interface MatchingProcessTable {
  userInfo: UserInfoDTO;
  matchingProcesses: MatchingProcess[] | undefined;
}

export const MatchingProcessTable = ({
  userInfo,
  matchingProcesses,
}: MatchingProcessTable) => {
  if (!matchingProcesses) {
    matchingProcesses = mockMatchingProcesses;
  }

  return (
    <div className="mt-6 mb-10">
      <div className="mb-2">
        <Typography variant="h5">Matching Process Management</Typography>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Developer</StyledTableCell>
              <StyledTableCell>Employer</StyledTableCell>
              <StyledTableCell>Position</StyledTableCell>
              <StyledTableCell align="right" sx={{ minWidth: 120 }}>
                Proposed
              </StyledTableCell>
              <StyledTableCell align="right">Interviews</StyledTableCell>
              <StyledTableCell align="right">Contracts</StyledTableCell>
              <StyledTableCell align="right">Placed</StyledTableCell>
              <StyledTableCell align="right">Remove</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchingProcesses.map(process => (
              <MatchingProcessTableRow
                key={process.id}
                process={process}
                userInfo={userInfo}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
