import {
  Developer,
  Skill,
  DeveloperFilterFormValues,
  UserInfoDTO,
} from '../../../types/innerTypes';
import { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { DevCard } from '../../../components';
import DevFilters from './DevFilters';
import { developerFilter } from '../../../utils/utilities';
import { Pagination } from '@mui/material';

const AllDevs = ({
  allDevelopers,
  skills,
  userInfo,
}: {
  allDevelopers: Developer[];
  skills: Skill[];
  userInfo: UserInfoDTO;
}) => {
  const [searchFilter, setSearchFilter] = useState<DeveloperFilterFormValues>({
    searchKeyword: '',
    skillsFilter: [],
    speaksSwedish: false,
  });
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedDevelopers, setDisplayedDevelopers] = useState<Developer[]>(
    [],
  );
  const pageSize = 7;

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

  useEffect(() => {
    if (orderedDevelopers) {
      setDisplayedDevelopers(orderedDevelopers);
      setNumberOfPages(
        Math.floor(orderedDevelopers?.length ?? 0 / pageSize) + 1,
      );
      setCurrentPage(0);
    }
  }, [orderedDevelopers]);

  useEffect(() => {
    if (!orderedDevelopers) {
      return; // No developers to filter
    }

    const filteredDevelopers = developerFilter({
      orderedDevelopers,
      searchFilter,
    });

    const slicedDevelopers = filteredDevelopers.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize,
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

  return (
    <div className="flex justify-center">
      <div className="max-w-[800px] mx-10">
        <DevFilters setSearchFilter={setSearchFilter} skills={skills} />
        <div className="jobcards">
          {displayedDevelopers &&
            displayedDevelopers.map((dev) => {
              const isLikedDeveloper = userInfo.developers
                .map((developer) => developer.id)
                .includes(dev.id);
              return (
                <DevCard
                  key={dev.id}
                  developer={dev}
                  isLiked={isLikedDeveloper}
                />
              );
            })}
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
