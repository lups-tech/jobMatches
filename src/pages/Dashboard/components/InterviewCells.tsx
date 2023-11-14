import { InterviewCell } from './InterviewCell';
import { MatchingProcess } from '../../../types/innerTypes';
import { IconButton } from '@mui/material';
import InterviewSelector from './InterviewSelector';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';

interface InterviewCellsProps {
  process: MatchingProcess;
}

export const InterviewCells = ({ process }: InterviewCellsProps) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div>
      {process.interviews.length > 0 &&
        process.interviews.map(interview => (
          <div key={interview.id}>
            <InterviewCell key={interview.id} interview={interview} />
          </div>
        ))}
      <div>
        {!isAdding && (
          <IconButton
            aria-label="Add interview"
            onClick={() => setIsAdding(true)}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
        {isAdding && (
          <InterviewSelector setIsAdding={setIsAdding} process={process} />
        )}
      </div>
    </div>
  );
};
