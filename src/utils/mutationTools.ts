import axios from 'axios';
import { Skill } from '../types/innerTypes';

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
