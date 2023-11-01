/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
  AddCommentRequestBody,
  DeleteCommentRequestBody,
  Skill,
} from '../types/innerTypes';
import { DevFormSchema } from '../types/validationTypes';
import * as z from 'zod';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const handleAddSkill = async (
  newSkillName: string,
  skillType: string,
  getAccessTokenSilently: any,
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
    },
  );

  const skill: Skill = response.data;
  return skill;
};

export const editPassword = async (
  newPassword: string,
  accessToken: string,
) => {
  await axios.patch(
    `${backendServer}api/users/editpassword`,
    { password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
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
    },
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
    },
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
