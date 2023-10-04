import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  Developer,
  Skill,
  DeveloperFilterFormValues,
} from '../types/innerTypes';
import { ChangeEvent, useEffect, useState, useMemo } from 'react';
import DevCard from './DevCard';
import DevFilters from './DevFilters';

const backendServer = import.meta.env.VITE_BE_SERVER;

const fetchSkills = async (accessToken: string): Promise<Skill[]> => {
  const res = await fetch(`${backendServer}api/Skills`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

const fetchDevelopers = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/developers`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

const AllDevs = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [searchFilter, setSearchFilter] = useState<DeveloperFilterFormValues>({
    searchKeyword: '',
    skillsFilter: [],
    speaksSwedish: false,
  });

  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 7;

  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[]>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });

  const {
    isLoading,
    error,
    data: allDevelopers,
  } = useQuery<Developer[], Error>({
    queryKey: ['allDevelopers'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      return fetchDevelopers(accessToken);
    },
  });

  const orderedDevelopers = useMemo(() => {
    if (allDevelopers) {
      return allDevelopers.slice().sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    return [];
  }, [allDevelopers]);

  const [displayedDevelopers, setDisplayedDevelopers] = useState<Developer[]>(
    []
  );

  useEffect(() => {
    if (!isLoading && orderedDevelopers) {
      setDisplayedDevelopers(orderedDevelopers);
      setNumberOfPages(
        Math.floor(orderedDevelopers?.length ?? 0 / pageSize) + 1
      );
      setCurrentPage(0);
    }
  }, [isLoading, orderedDevelopers]);

  useEffect(() => {
    if (!orderedDevelopers) {
      return; // No developers to filter
    }

    const filteredDevelopers = orderedDevelopers.filter((dev: Developer) => {
      const devSkills = dev.skills.map((skill: Skill) => skill.title);
      const devName = dev.name.toLowerCase();
      const speaksSwedish = devSkills.includes('Swedish');
      const matchingSkills = devSkills.includes(searchFilter.searchKeyword);
      const matchingName = devName.includes(searchFilter.searchKeyword);
      const matchingProgrammingLanguages = searchFilter.skillsFilter.every(
        skill => devSkills.includes(skill)
      );

      if (searchFilter.speaksSwedish && !speaksSwedish) {
        return false;
      }

      if (
        searchFilter.speaksSwedish &&
        speaksSwedish &&
        searchFilter.searchKeyword === '' &&
        searchFilter.skillsFilter.length === 0
      ) {
        return true;
      }

      if (
        searchFilter.speaksSwedish &&
        speaksSwedish &&
        matchingProgrammingLanguages &&
        (matchingSkills || matchingName)
      ) {
        return true;
      }

      if (matchingProgrammingLanguages && (matchingSkills || matchingName)) {
        return true;
      }

      return false;
    });

    const slicedDevelopers = filteredDevelopers.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize
    );

    setDisplayedDevelopers(slicedDevelopers);
    setNumberOfPages(Math.floor(filteredDevelopers.length / pageSize));
    setCurrentPage(currentPage);
  }, [searchFilter, orderedDevelopers, currentPage]);

  useEffect(() => {
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
    console.log('❗️error: ', error);
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
            displayedDevelopers.map(dev => (
              <DevCard key={dev.id} developer={dev} />
            ))}
        </div>
        <div className="flex justify-center my-10">
          <Pagination
            count={numberOfPages}
            color="secondary"
            onChange={pageChangeHandler}
            page={currentPage + 1}
          />
        </div>
      </div>
    </div>
  );
};

export default AllDevs;
