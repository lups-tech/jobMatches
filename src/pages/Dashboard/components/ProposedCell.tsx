import { Typography, Checkbox } from '@mui/material';
import { MatchingProcess } from '../../../types/innerTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  patchPlacedRequest,
  patchProposedRequest,
} from '../../../utils/mutationTools';

interface ProposedCellProps {
  process: MatchingProcess;
}

export const ProposedCell = ({ process }: ProposedCellProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();
  const proposedMutation = useMutation(patchProposedRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });
  const placedMutation = useMutation(patchPlacedRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });
  const proposedHandle = (result: boolean) => {
    proposedMutation.mutate({ result, process, getAccessTokenSilently });
    // add placed state
    if (!result) {
      placedMutation.mutate({
        result: false,
        process,
        getAccessTokenSilently,
      });
    }
    // remove the placed state
    if (result && process.placed === false) {
      placedMutation.mutate({
        result: null,
        process,
        resetDate: true,
        getAccessTokenSilently,
      });
    }
  };
  if (process.proposed) {
    return (
      <Typography
        variant="body1"
        sx={
          process.proposed.succeeded
            ? { color: '#8baf73', fontWeight: 'bold' }
            : { color: '#c77071', fontWeight: 'bold' }
        }
      >
        {process.proposed.date.split('T')[0]}
      </Typography>
    );
  }
  return (
    <div>
      Succeeded
      <Checkbox color="success" onChange={() => proposedHandle(true)} />
      Rejected
      <Checkbox color="error" onChange={() => proposedHandle(false)} />
    </div>
  );
};
