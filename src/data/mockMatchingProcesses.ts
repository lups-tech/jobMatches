import { MatchingProcess } from '../types/innerTypes';

export const mockMatchingProcesses: MatchingProcess[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    proposed: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      date: '2023-11-09T10:36:15.366Z',
      succeeded: true,
    },
    interviews: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66af44',
        date: '',
        interviewType: 'Personal',
        passed: false,
      },
    ],
    contracts: [],
    placed: false,
    resultDate: '2023-11-09T10:36:15.366Z',
    developerId: 'c4731b35-0096-4a1e-b62a-44ec16ed626f',
    jobId: '488df331-61dc-493a-86ea-a184a0de86f3',
    userId: 'google-oauth2|105981917209000515118',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afff',
    proposed: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      date: '2023-11-09T10:36:15.366Z',
      succeeded: true,
    },
    interviews: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        date: '2023-11-09T10:36:15.366Z',
        interviewType: 'Personal',
        passed: true,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66af22',
        date: '2023-11-09T10:36:15.366Z',
        interviewType: 'Technical',
        passed: false,
      },
    ],
    contracts: [],
    placed: false,
    resultDate: '2023-11-09T10:36:15.366Z',
    developerId: 'a18a64a5-7c0f-46aa-b19c-20830f3536b2',
    jobId: '38e45189-1525-4dd2-9bea-c637a66dcb76',
    userId: 'google-oauth2|105981917209000515118',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66affdd',
    proposed: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      date: '2023-11-09T10:36:15.366Z',
      succeeded: true,
    },
    interviews: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        date: '2023-11-09T10:36:15.366Z',
        interviewType: 'Personal',
        passed: true,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66af22',
        date: '2023-11-09T10:36:15.366Z',
        interviewType: 'Technical',
        passed: true,
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66af33',
        date: '2023-11-09T10:36:15.366Z',
        interviewType: 'Group',
        passed: true,
      },
    ],
    contracts: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        date: '2023-11-09T10:36:15.366Z',
        contractStage: 'Signed',
      },
    ],
    placed: true,
    resultDate: '2023-11-09T10:36:15.366Z',
    developerId: '3750afbb-7f98-485a-af3b-f52b04bf088c',
    jobId: '38e45189-1525-4dd2-9bea-c637a66dcb76',
    userId: 'google-oauth2|105981917209000515118',
  },
];
