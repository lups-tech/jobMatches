/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
  AddCommentRequestBody,
  DeleteCommentRequestBody,
  MatchingProcess,
  Skill,
} from '../types/innerTypes';
import { DevFormSchema } from '../types/validationTypes';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const handleAddSkill = async (
  newSkillName: string,
  skillType: string,
  getAccessTokenSilently: any
) => {
  const accessToken = await getAccessTokenSilently();
  const response = await axios.post(
    `${backendServer}api/skills`,
    {
      title: newSkillName,
      type: skillType,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const skill: Skill = response.data;
  return skill;
};

export const editPassword = async (
  newPassword: string,
  accessToken: string
) => {
  await axios.patch(
    `${backendServer}api/users/editpassword`,
    { password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const sendAddCommentRequest = async ({
  commentText,
  userEmail,
  developerId,
  getAccessTokenSilently,
}: AddCommentRequestBody) => {
  const accessToken = await getAccessTokenSilently();
  const response = await axios.post(
    `${backendServer}api/comments`,
    {
      commentText: commentText,
      userEmail: userEmail,
      developerId: developerId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const comment: Comment = response.data;
  return comment;
};

export const sendDeleteCommentRequest = async ({
  commentId,
  getAccessTokenSilently,
}: DeleteCommentRequestBody) => {
  const accessToken = await getAccessTokenSilently();
  const response = await axios.delete(
    `${backendServer}api/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const comment: Comment = response.data;
  return comment;
};

export const postDeveloperRequest = async ({
  data,
  getAccessTokenSilently,
}: {
  data: z.infer<typeof DevFormSchema>;
  getAccessTokenSilently: any;
}) => {
  const accessToken = await getAccessTokenSilently();
  const res = await axios.post(`${backendServer}api/developers`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
export const postJobRequest = async ({
  createJobReq,
  getAccessTokenSilently,
}: any) => {
  const accessToken = await getAccessTokenSilently();
  const res = await axios.post(`${backendServer}api/jobs`, createJobReq, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const postMatchingProcessRequest = async ({
  data,
  getAccessTokenSilently,
}: {
  data: { developerId: string; jobId: string };
  getAccessTokenSilently: any;
}) => {
  const accessToken = await getAccessTokenSilently();
  const res = await axios.post(`${backendServer}api/matchingprocess`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const patchProposedRequest = async ({
  result,
  process,
  getAccessTokenSilently,
}: {
  result: boolean;
  process: MatchingProcess;
  getAccessTokenSilently: any;
}) => {
  const accessToken = await getAccessTokenSilently();
  const newProposed = { id: uuidv4(), date: new Date(), succeeded: result };
  const data = { ...process, proposed: newProposed };
  return axios.patch(`${backendServer}api/matchingprocess`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const patchInterviewRequest = async ({
  interviewType,
  process,
  getAccessTokenSilently,
}: {
  interviewType: string;
  process: MatchingProcess;
  getAccessTokenSilently: any;
}) => {
  const accessToken = await getAccessTokenSilently();
  const newInterview = {
    id: uuidv4(),
    date: new Date(),
    interviewType,
    passed: null,
  };
  const newInterviews = [...process.interviews, newInterview];
  const data = { ...process, interviews: newInterviews, proposed: null };
  console.log(data);
  return axios.patch(`${backendServer}api/matchingprocess`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteMatchingProcessRequest = async ({
  processId,
  getAccessTokenSilently,
}: {
  processId: string;
  getAccessTokenSilently: any;
}) => {
  const accessToken = await getAccessTokenSilently();
  return axios.delete(`${backendServer}api/matchingprocess/${processId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
