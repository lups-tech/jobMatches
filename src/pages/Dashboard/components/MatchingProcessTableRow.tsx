import {
  Box,
  Collapse,
  Table,
  TableBody,
  IconButton,
  styled,
  TableHead,
  Typography,
  TableCell,
  tableCellClasses,
  TableRow,
  Checkbox,
} from '@mui/material';
import { MatchingProcess, UserInfoDTO } from '../../../types/innerTypes';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InterviewCell } from './InterviewCell';

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTableRow key={process.id}>
        <StyledTableCell component="th" scope="row">
          {
            userInfo.developers.find(
              (developer) => developer.id === process.developerId,
            )?.name
          }
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {userInfo.jobs.find((job) => job.id === process.jobId)?.employer}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {userInfo.jobs.find((job) => job.id === process.jobId)?.title}
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.proposed.succeeded
            ? process.proposed.date.split('T')[0]
            : 'No'}
        </StyledTableCell>
        <StyledTableCell align="right">
          <div>
            {process.interviews.map((interview) => (
              <InterviewCell interview={interview} />
            ))}
          </div>
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.contracts.length}
        </StyledTableCell>
        <StyledTableCell align="right">
          {process.placed ? 'Yes' : 'No'}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
