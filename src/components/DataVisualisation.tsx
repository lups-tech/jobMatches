import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { JobsChart } from "./JobsChart";
// import { FormComponent } from "./DataForm";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skill } from "../types/innerTypes";
import { useAuth0 } from "@auth0/auth0-react";

const labels = ["3-4 weeks ago", "2-3 weeks ago", "1-2 weeks ago", "Last week"];

type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

type Dataset = {
  id: number;
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

const backendServer = import.meta.env.VITE_BE_SERVER;

const getDataBySearchAndDates = async (
  programmingLanguage: string,
  dateAfter: string,
  dateBefore: string
) => {
  try {
    const response = await axios.get(
      `https://jobsearch.api.jobtechdev.se/search?published-before=${dateBefore}T00%3A00%3A00&published-after=${dateAfter}T00%3A00%3A00&q=${programmingLanguage}&offset=0&limit=100`
    )
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const fetchSkills = async (accessToken: string) => {
  const res = await axios.get(`${backendServer}api/skills`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const updateCounts = (dataPublicationData: string[]) => {
  let thisWeek = 0;
  let oneWeekOld = 0;
  let twoWeekOld = 0;
  let threeWeekOld = 0;

  dataPublicationData.forEach((date) => {
    const timeDiff = Date.now() - new Date(date).getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (days < 8) {
      thisWeek++;
    }
    if (days >= 8 && days < 15) {
      oneWeekOld++;
    }
    if (days >= 15 && days < 22) {
      twoWeekOld++;
    }
    if (days >= 22 && days < 29) {
      threeWeekOld++;
    }
  });

  return ([threeWeekOld, twoWeekOld, oneWeekOld, thisWeek])
};

export const DataVisualisation = () => {
  const todaysDate = new Date(Date.now()).toISOString().replace(/T.*/, "");
  const oneMonth = 2592000000;
  const oneMonthAgoDate = new Date(Date.now() - oneMonth)
    .toISOString()
    .replace(/T.*/, "");
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  useEffect(() => {
    if (searchQueries.length > 0) {
      searchQueries.map((searchQuery) => {
        getDataBySearchAndDates(searchQuery, oneMonthAgoDate, todaysDate).then(
          (response) => {
            const publicationDates = response.hits.map((job: { publication_date: string; }) => job.publication_date)
            const counts = updateCounts(publicationDates)
            updateChartData(searchQuery, counts)
          }
         
        );
      });
    }
  }, [searchQueries]);

  const { getAccessTokenSilently } = useAuth0();
  const {
    isLoading: isSkillsLoading,
    error: skillsError,
    data: skills,
  } = useQuery<Skill[], Error>(["skills"], async () => {
    const accessToken = await getAccessTokenSilently();
    return fetchSkills(accessToken);
  });


  const [chartData, setChartData] = useState<any>({
    labels,
    datasets: [
      {
        label: "",
        data: [],
        borderColor: "rgba(00,0,0,0)",
        backgroundColor: "rgba(00,0,0,0)",
      },
    ],
  });

  const updateChartData = (
    searchKeyword: string,
    counts: number[]
  ) => {
    setChartData((prevState: ChartData) => {
      const foundDataSet = prevState.datasets.find(
        (dataset: Dataset) => dataset.label === searchKeyword
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
      const lineColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
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
          className="w-96"
          multiple
          options={skills.filter((s) => s.type === "Programming Language")}
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
