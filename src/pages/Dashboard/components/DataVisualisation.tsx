import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { JobsChart } from './JobsChart';
import { useQuery } from '@tanstack/react-query';
import { ChartData, Dataset, Skill } from '../../../types/innerTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { cardColorLogic } from '../../../data/programmingLanguageColors';
import { getDataBySearchAndDates } from '../../../utils/apiTools';
import { fetchSkills } from '../../../utils/fetchingTools';
import { labels, updateCounts } from '../../../utils/utilities';

export const DataVisualisation = () => {
  const todaysDate = new Date(Date.now()).toISOString().replace(/T.*/, '');
  const oneMonth = 2592000000;
  const oneMonthAgoDate = new Date(Date.now() - oneMonth)
    .toISOString()
    .replace(/T.*/, '');
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  useEffect(() => {
    if (searchQueries.length > 0) {
      searchQueries.map((searchQuery) => {
        getDataBySearchAndDates(searchQuery, oneMonthAgoDate, todaysDate).then(
          (response) => {
            const publicationDates = response.hits.map(
              (job: { publication_date: string }) => job.publication_date,
            );
            const counts = updateCounts(publicationDates);
            updateChartData(searchQuery, counts);
          },
        );
      });
    }
  }, [searchQueries]);

  const { getAccessTokenSilently } = useAuth0();
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[], Error>(['skills'], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });

  const [chartData, setChartData] = useState<any>({
    labels,
    datasets: [
      {
        label: '',
        data: [],
        borderColor: 'rgba(00,0,0,0)',
        backgroundColor: 'rgba(00,0,0,0)',
      },
    ],
  });

  const updateChartData = (searchKeyword: string, counts: number[]) => {
    setChartData((prevState: ChartData) => {
      const foundDataSet = prevState.datasets.find(
        (dataset: Dataset) => dataset.label === searchKeyword,
      );

      if (foundDataSet) {
        const updatedDatasets = prevState.datasets.map((dataset: Dataset) => {
          if (dataset.label === searchKeyword) {
            return {
              ...dataset,
              label: searchKeyword,
              data: counts,
            };
          }
          return dataset;
        });
        return {
          ...prevState,
          datasets: updatedDatasets,
        };
      }

      const lineColor = cardColorLogic[searchKeyword] ?? 'grey'; // update 'data/programmingLanguageColors' when adding new languages
      return {
        ...prevState,
        datasets: [
          ...prevState.datasets,
          {
            label: searchKeyword,
            data: counts,
            borderColor: lineColor,
            backgroundColor: lineColor,
          },
        ],
      };
    });
  };

  if (isSkillsLoading) return <p>Loading...</p>;
  if (skillsError || skills === undefined)
    return <p>An error has occurred: {skillsError?.message}</p>;

  return (
    <div className="max-w-[1000px] mx-auto my-5 flex flex-col flex-wrap gap-0.5 items-center justify-center">
      <div className={`max-w-[1000px] flex flex-wrap`}>
        <Autocomplete
          className="w-96 mb-[-3rem]"
          multiple
          options={skills.filter((s) => s.type === 'Programming Language')}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField {...params} label={`Search programming language`} />
          )}
          onChange={(_event, value) => {
            const searchArray = value.map((s) => s.title);
            setSearchQueries(searchArray);
          }}
        />
      </div>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <JobsChart chartData={chartData} />
      </div>
    </div>
  );
};
