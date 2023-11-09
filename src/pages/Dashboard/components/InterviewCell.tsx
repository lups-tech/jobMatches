import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Interview } from '../../../types/innerTypes';

interface InterviewCellProps {
  interview: Interview;
}

export const InterviewCell = ({ interview }: InterviewCellProps) => {
  return (
    <div className="flex justify-between">
      <p>{interview.interviewType}</p>
      <span>
        <CheckCircleIcon
          color="success"
          sx={interview.passed ? undefined : { color: '#bbbbbb' }}
        />
        <CancelIcon
          color="error"
          sx={interview.passed ? { color: '#bbbbbb' } : undefined}
        />
        <CalendarMonthIcon sx={{ color: '#bbbbbb' }} />
      </span>
    </div>
  );
};
