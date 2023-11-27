/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Job } from '../types/jobTechApiTypes';
import { JobDTO } from '../types/innerTypes';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const fetchUserInfo = async (accessToken: string, userId: string) => {
  const userIdUrlString = encodeURIComponent(userId);
  const res = await axios.get(`${backendServer}api/users/${userIdUrlString}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const fetchAuth0Users =async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/auth0sales`, {
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

export const fetchMatches = async (job: Job, accessToken: string) => {
  const jobDescription = { description: job.description.text };
  const res = await axios.post(`${backendServer}scraper`, jobDescription, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const fetchMatchingProcess = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/matchingprocess`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const checkIfAJobIsExisted = async (
  accessToken: string,
  jobId: string,
) => {
  const allJobs: JobDTO[] = await getAllJobs(accessToken);
  return allJobs.find((job) => job.jobTechId === jobId);
};

export const getAllJobs = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/jobs`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const InviteUser = async (inviteEmail: string, SenderName: string, accessToken: string) => {
  const body = {
    email : inviteEmail,
    role : "Sales",
    name : SenderName,
}
  await axios.post(`${backendServer}api/users/register`, 
            body, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
  );
}

export const UpgradeUser = async (userToUpgradeId: string, accessToken: string) => {
  const body = {
    userId : userToUpgradeId,
    role : "Admin",
  }
  await axios.patch(`${backendServer}api/users/upgrade`, 
            body, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
  );
}