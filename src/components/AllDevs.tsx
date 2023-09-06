import axios, { all } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Developer } from "../types/innerTypes";
import { ChangeEvent, useEffect, useState } from "react";
import DevCard from "./DevCard";
// import { Skill } from '../types/innerTypes';

const backendServer = import.meta.env.VITE_BE_SERVER;

// const fetchSkills = async (): Promise<Skill[]> => {
//     const res = await fetch(`${backendServer}api/Skills`);
//     return res.json();
//   };

const fetchDevelopers = async (accessToken: String) => {
  const res = await axios.get(`${backendServer}api/developers`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    // params: { 
    //   offset,
    //   limit: pageNumber },
  });
  return res.data;
};

const AllDevs = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 7;

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

 const displayedDevelopers = allDevelopers?.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  console.log(displayedDevelopers);



  const pageChangeHandler = (_event: ChangeEvent<unknown>, value: number) => {
      value = value - 1;
      setCurrentPage(value);
  };

    useEffect(() => {
      setCurrentPage(0);
    }, []);

  if (isLoading)
    return (
      <div className="flex justify-center mt-16">
        Loading
        {/* <CircularProgress /> */}
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        {/* <JobFilters setSearchKeyword={setSearchKeyword} skills={skills} /> */}
        <div className="jobcards">
          {displayedDevelopers &&
            displayedDevelopers.map((dev) => (
              <DevCard key={dev.id} developer={dev} />
              ))}
        </div>
              <Pagination 
                count={Math.floor(allDevelopers.length / pageSize) + 1}
                variant="outlined"
                shape="rounded"
                onChange={pageChangeHandler}
                page={currentPage + 1}
              />
      </div>
    </div>
  );
};

export default AllDevs;
