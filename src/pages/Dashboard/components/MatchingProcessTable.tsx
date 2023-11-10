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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Developer</StyledTableCell>
            <StyledTableCell>Employer</StyledTableCell>
            <StyledTableCell>Position</StyledTableCell>
            <StyledTableCell align="right">Proposed</StyledTableCell>
            <StyledTableCell align="right">Interviews</StyledTableCell>
            <StyledTableCell align="right">Contracts</StyledTableCell>
            <StyledTableCell align="right">Placed</StyledTableCell>
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
  );
};
