import axios from 'axios';
import { SearchResult } from '../types/externalTypes';
import { FilterFormValues } from '../types/innerTypes';

export const getDataBySearchAndDates = async (
  programmingLanguage: string,
  dateAfter: string,
  dateBefore: string,
) => {
  try {
    const response = await axios.get(
      `https://jobsearch.api.jobtechdev.se/search?published-before=${dateBefore}T00%3A00%3A00&published-after=${dateAfter}T00%3A00%3A00&q=${programmingLanguage}&offset=0&limit=100`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchRegions = async () => {
  const res = await fetch(
    'https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts/region',
  );
  return res.json();
};

export const fetchJobs = async (
  searchFilter: FilterFormValues,
  page: number,
): Promise<SearchResult> => {
  const res = await fetch(
    `https://jobsearch.api.jobtechdev.se/search?${searchFilter.regionFilter
      .map(
        (region) =>
          `region=${region['taxonomy/national-nuts-level-3-code-2019']}`,
      )
      .join('&')}&experience=${
      searchFilter.isExperienced
    }&q=${encodeURIComponent(
      searchFilter.skillsFilter.join(' ') + ' ' + searchFilter.searchKeyword,
    )}&offset=${page * 10}&limit=10`,
  );
  return res.json();
};