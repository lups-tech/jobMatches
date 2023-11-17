import { Typography, Checkbox } from '@mui/material';
import { MatchingProcess } from '../../../types/innerTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchPlacedRequest } from '../../../utils/mutationTools';

interface PlacedCellProps {
  process: MatchingProcess;
}

export const PlacedCell = ({ process }: PlacedCellProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();
  const placedMutation = useMutation(patchPlacedRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });
  const proposedHandle = (result: boolean) => {
    placedMutation.mutate({ result, process, getAccessTokenSilently });
  };
  if (process.resultDate === null) {
    if (process.contracts[0]?.contractStage === 'Signed') {
      return (
        <div>
          Succeeded
          <Checkbox color="success" onChange={() => proposedHandle(true)} />
          Rejected
          <Checkbox color="error" onChange={() => proposedHandle(false)} />
        </div>
      );
    }
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
