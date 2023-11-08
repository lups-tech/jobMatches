/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { FilterFormValues } from '../types/innerTypes';
import { SearchResult } from '../types/externalTypes';
import { Job } from '../types/jobTechApiTypes';

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
      response.json().then(data => setIdforDelete(data.id));
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

export const fetchJobs = async (
  searchFilter: FilterFormValues,
  page: number
): Promise<SearchResult> => {
  const res = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?${searchFilter.regionFilter
      .map(
        region => `region=${region['taxonomy/national-nuts-level-3-code-2019']}`
      )
      .join('&')}&experience=${
      searchFilter.isExperienced
    }&q=${encodeURIComponent(
      searchFilter.skillsFilter.join(' ') + ' ' + searchFilter.searchKeyword
    )}&offset=${page * 10}&limit=10`
  );
  return res.json();
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

export const checkIfAJobIsExisted = async () => {};
