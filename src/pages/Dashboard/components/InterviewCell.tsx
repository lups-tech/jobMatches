import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Interview, MatchingProcess } from '../../../types/innerTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteInterviewRequest,
  patchInterviewRequest,
  patchPlacedRequest,
} from '../../../utils/mutationTools';
import { useAuth0 } from '@auth0/auth0-react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface InterviewCellProps {
  interview: Interview;
  process: MatchingProcess;
}

export const InterviewCell = ({ interview, process }: InterviewCellProps) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [interviewDate, setInterviewDate] = useState<Dayjs | null>(
    dayjs(interview.date)
  );
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();
  const interviewMutation = useMutation(patchInterviewRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const interviewDeleteMutation = useMutation(deleteInterviewRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const placedMutation = useMutation(patchPlacedRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['matchingProcess']);
    },
  });

  const handleClose = () => setOpenDatePicker(false);

  const interviewUpdateHandle = (interviewResult: boolean) => {
    const updatedInterview = { ...interview, passed: interviewResult };
    interviewMutation.mutate({
      updatedInterview,
      process,
      getAccessTokenSilently,
    });
    // add placed state
    if (!interviewResult) {
      placedMutation.mutate({
        result: false,
        process,
        getAccessTokenSilently,
      });
    }
    // remove the placed state
    if (interviewResult && process.placed === false) {
      placedMutation.mutate({
        result: null,
        process,
        resetDate: true,
        getAccessTokenSilently,
      });
    }
  };

  const updateInterviewDateHandle = () => {
    const updatedDate = new Date(dayjs(interviewDate).format());
    const updatedInterview = { ...interview, date: updatedDate.toISOString() };
    interviewMutation.mutate({
      updatedInterview,
      process,
      getAccessTokenSilently,
    });
    setOpenDatePicker(false);
  };

  const deleteInterviewHandle = (interviewId: string) => {
    interviewDeleteMutation.mutate({ interviewId, getAccessTokenSilently });
  };

  return (
    <div className="flex flex-row justify-between">
      <p>{interview.interviewType}</p>
      <span className="w-24">
        <CheckCircleIcon
          color="success"
          sx={
            interview.passed === true
              ? undefined
              : { color: '#bbbbbb', cursor: 'pointer' }
          }
          onClick={() => interviewUpdateHandle(true)}
        />
        <CancelIcon
          color="error"
          sx={
            interview.passed === false
              ? undefined
              : { color: '#bbbbbb', cursor: 'pointer' }
          }
          onClick={() => interviewUpdateHandle(false)}
        />
        <CalendarMonthIcon
          sx={{ color: '#bbbbbb', cursor: 'pointer' }}
          onClick={() => setOpenDatePicker(true)}
        />
        <DeleteIcon
          sx={{ color: '#bbbbbb', cursor: 'pointer' }}
          onClick={() => deleteInterviewHandle(interview.id)}
        />
        <Modal open={openDatePicker} onClose={handleClose}>
          <div className="absolute top-1/3 left-1/3 flex flex-col bg-white rounded-3xl p-2">
            <DateCalendar
              value={interviewDate}
              onChange={newValue => setInterviewDate(newValue)}
              sx={{ cursor: 'pointer' }}
            />
            <Button className="mx-auto" onClick={updateInterviewDateHandle}>
              Update interview date
            </Button>
          </div>
        </Modal>
      </span>
    </div>
  );
};
