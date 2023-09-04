import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { Developer } from "../types/innerTypes";

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchDevelopers = async (accessToken: String) => {
  const res = await axios.get(`${backendServer}api/developers`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

const AllDevs = () => {
  const { getAccessTokenSilently } = useAuth0();

  const {
    isLoading,
    error,
    data: allDevelopers,
  } = useQuery<Developer[], Error>({
    queryKey: ["allDevelopers"],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      return fetchDevelopers(accessToken);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {allDevelopers && allDevelopers.map((dev) => <div>{dev.name}</div>)}
    </div>
  );
};

export default AllDevs;
