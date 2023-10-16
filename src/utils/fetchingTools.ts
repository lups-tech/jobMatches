import axios from 'axios';

const backendServer = import.meta.env.VITE_BE_SERVER;

export const fetchUserInfo = async (accessToken: string, userId: string) => {
  const userIdUrlString = encodeURIComponent(userId);
  const res = await axios.get(`${backendServer}api/users/${userIdUrlString}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};
