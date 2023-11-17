import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  deleteContractRequest,
  patchContractRequest,
  patchNewContractRequest,
} from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { MatchingProcess } from '../../../types/innerTypes';

interface ContractSelectorProps {
  process: MatchingProcess;
}

const ContractSelector = ({ process }: ContractSelectorProps) => {
  const [localContractTypeState, setLocalContractTypeState] = useState(
    process.contracts[0] ? process.contracts[0].contractStage : ''
  );
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();

  const newContractMutation = useMutation(patchNewContractRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const contractMutation = useMutation(patchContractRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const deleteContractMutation = useMutation(deleteContractRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    const localContractType = event.target.value;
    setLocalContractTypeState(localContractType);
    if (localContractType === 'CANCEL') {
      console.log('deleting contract: ', process.contracts[0]);
      deleteContractMutation.mutate({
        contractId: process.contracts[0].id,
        getAccessTokenSilently,
      });
    } else {
      if (process.contracts[0]) {
        const updatedContract = {
          ...process.contracts[0],
          contractStage: localContractType,
        };
        console.log('updating contract stage: ', updatedContract);
        contractMutation.mutate({
          updatedContract,
          process,
          getAccessTokenSilently,
        });
      } else {
        console.log('creating new contract stage', localContractType);
        newContractMutation.mutate({
          contractStage: localContractType,
          process,
          getAccessTokenSilently,
        });
      }
    }
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={localContractTypeState}
          onChange={handleChange}
          label="ContractType"
        >
          <MenuItem value="CANCEL">
            <em>Cancel</em>
          </MenuItem>
          <MenuItem value={'Negotiating'}>Negotiating</MenuItem>
          <MenuItem value={'Awaiting'}>Awaiting</MenuItem>
          <MenuItem value={'Signed'}>Signed</MenuItem>
          <MenuItem value={'Failed'}>Failed</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ContractSelector;
