import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  Developer,
  Skill,
  DeveloperFilterFormValues,
} from "../types/innerTypes";
import { ChangeEvent, useEffect, useState } from "react";
import DevCard from "./DevCard";
import DevFilters from "./DevFilters";

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (accessToken: string): Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

const fetchDevelopers = async (accessToken: String) => {
  const res = await axios.get(`${backendServer}api/developers`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("all devs", res.data);

  return res.data;
};

const AllDevs = () => {
  const [searchFilter, setSearchFilter] = useState<DeveloperFilterFormValues>({
    searchKeyword: "",
    skillsFilter: [],
  });
  const [displayedDevelopers, setDisplayedDevelopers] = useState<Developer[]>();
  const [numberOfPages, setNumberOfPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  const pageSize = 7;

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(["skills"], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });

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

  useEffect(() => {
    const orderedDevelopers = allDevelopers?.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    if (
      searchFilter.searchKeyword === "" &&
      searchFilter.skillsFilter.length === 0
    ) {
      setDisplayedDevelopers(orderedDevelopers);
      setNumberOfPages(
        Math.floor(orderedDevelopers?.length ?? 0 / pageSize) + 1
      );
      setCurrentPage(0);
      return;
    }

    const filteredDevelopers = orderedDevelopers?.filter((dev: Developer) => {
      const devSkills = dev.skills.map((skill: Skill) => skill.title);
      const matchingSkills = devSkills.includes(searchFilter.searchKeyword);
      const matchingProgrammingLanguages = devSkills.includes(
        searchFilter.searchKeyword
      );
      if (matchingSkills && matchingProgrammingLanguages) {
        return true;
      }
      if (
        dev.name
          .toLowerCase()
          .includes(searchFilter.searchKeyword.toLowerCase())
      ) {
        return true;
      }
      return false;
    });

    const slicedDevelopers = filteredDevelopers?.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize
    );
    setDisplayedDevelopers(slicedDevelopers);
    setNumberOfPages(Math.floor(orderedDevelopers?.length ?? 0 / pageSize) + 1);
    setCurrentPage(0);
  }, [searchFilter]);

  const pageChangeHandler = (_event: ChangeEvent<unknown>, value: number) => {
    value = value - 1;
    setCurrentPage(value);
  };

  if (isLoading || isSkillsLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircularProgress />
      </div>
    );

  if (error || skillsError) {
    console.log("❗️error: ", error);
    return (
      <div className="flex justify-center mt-16">
        An error has occurred, check console for more info
      </div>
    );
  }

  if (!skills) {
    return;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        <DevFilters setSearchFilter={setSearchFilter} skills={skills} />
        <div className="jobcards">
          {displayedDevelopers &&
            displayedDevelopers.map((dev) => (
              <DevCard key={dev.id} developer={dev} />
            ))}
        </div>
        <Pagination
          count={numberOfPages}
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
