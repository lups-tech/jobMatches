import { Typography } from '@mui/material';
import { MatchingProcess } from '../../../types/innerTypes';

interface PlacedCellProps {
  process: MatchingProcess;
}

export const PlacedCell = ({ process }: PlacedCellProps) => {
  if (process.resultDate === null) {
    return <Typography>Not Yet</Typography>;
  } else {
    return (
      <Typography
        variant="body1"
        sx={
          process.placed
            ? { color: '#8baf73', fontWeight: 'bold' }
            : { color: '#c77071', fontWeight: 'bold' }
        }
      >
        {process.resultDate.split('T')[0]}
      </Typography>
    );
  }
};
