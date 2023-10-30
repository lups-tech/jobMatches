import axios from 'axios';
import { Skill } from '../types/innerTypes';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const fetchUserInfo = async (accessToken: string, userId: string) => {
  const userIdUrlString = encodeURIComponent(userId);
  const res = await axios.get(`${backendServer}api/users/${userIdUrlString}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

type ToggleLikeRequestArgs = {
  requestMethod: string;
  requestBody: {
    // for like and unlike a developer
    userId?: string;
    developerId?: string;
    // for unlike a job
    jobId?: string;
    // for like a job
    url?: string;
    jobTechId?: string;
    jobText?: string;
    selectedSkillIds?: string[];
  };
  endpointPath: string; // 'api/jobs'
  getAccessTokenSilently: any;
  setIdforDelete?: React.Dispatch<React.SetStateAction<string>>; // to process the data that backend returns
};

export const togglelikeRequest = async (args: ToggleLikeRequestArgs) => {
  const {
    requestMethod,
    requestBody,
    endpointPath,
    getAccessTokenSilently,
    setIdforDelete,
  } = args;
  try {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${backendServer}${endpointPath}`, {
      method: requestMethod,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    if (setIdforDelete && endpointPath == 'api/jobs') {
      response.json().then((data) => setIdforDelete(data.id));
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const fetchSkills = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/skills`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const fetchDevelopers = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/developers`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};
