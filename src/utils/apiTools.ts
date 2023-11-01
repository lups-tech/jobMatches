import axios from 'axios';

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
