import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { patchNewInterviewRequest } from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { MatchingProcess } from '../../../types/innerTypes';

interface InterviewSelectorProps {
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  process: MatchingProcess;
}

const InterviewSelector = ({
  setIsAdding,
  process,
}: InterviewSelectorProps) => {
  const [localInterviewTypeState, setLocalInterviewTypeState] = useState('');
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  const interviewMutation = useMutation(patchNewInterviewRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    const localInterviewType = event.target.value;
    setLocalInterviewTypeState(localInterviewType);
    console.log('value: ', localInterviewType);
    if (localInterviewType === 'CANCEL') {
      setIsAdding(false);
    } else if (localInterviewType !== '') {
      console.log('sending request with: ', localInterviewType);
      interviewMutation.mutate({
        interviewType: localInterviewType,
        process,
        getAccessTokenSilently,
      });
      setIsAdding(false);
    }
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={localInterviewTypeState}
          onChange={handleChange}
          label="InterviewType"
        >
          <MenuItem value="CANCEL">
            <em>Cancel</em>
          </MenuItem>
          <MenuItem value={'Personal'}>Personal</MenuItem>
          <MenuItem value={'Technical'}>Technical</MenuItem>
          <MenuItem value={'Group'}>Group</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default InterviewSelector;
