import { InterviewCell } from './InterviewCell';
import { MatchingProcess } from '../../../types/innerTypes';
import { Typography } from '@mui/material';
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
            <InterviewCell
              key={interview.id}
              interview={interview}
              process={process}
            />
          </div>
        ))}
      {process.contracts.length === 0 && (
        <div>
          {!isAdding && (
            <div className="flex justify-end items-center">
              <Typography variant="body2">Add Interview</Typography>
              <AddCircleOutlineIcon
                onClick={() => setIsAdding(true)}
                sx={{ cursor: 'pointer' }}
              />
            </div>
          )}
          {isAdding && (
            <InterviewSelector setIsAdding={setIsAdding} process={process} />
          )}
        </div>
      )}
    </div>
  );
};
