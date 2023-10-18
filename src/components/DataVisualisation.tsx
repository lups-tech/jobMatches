import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
import { useThemeContext } from "../theme";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { JobsChart } from "./JobsChart";

const getDataBySearchAndDates = async (
  programmingLanguage: string,
  dateAfter: string,
  dateBefore: string
): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `https://jobsearch.api.jobtechdev.se/search?published-before=${dateBefore}T00%3A00%3A00&published-after=${dateAfter}T00%3A00%3A00&q=${programmingLanguage}&offset=0&limit=100`
    );
    return response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const labels = ["3-4 weeks ago", "2-3 weeks ago", "1-2 weeks ago", "Last week"];

const FormComponent = ({ updateJobsPerWeek, formId }: any) => {
  const [inputValue, setInputValue] = useState<string>("")
  
  const todaysDate = new Date(Date.now()).toISOString().replace(/T.*/, "");
  const oneMonth = 2592000000;
  const oneMonthAgoDate = new Date(Date.now() - oneMonth)
    .toISOString()
    .replace(/T.*/, "");

  const [searchKeyword, setSearchKeyword] = useState<string>("javascript");

  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [oneWeekOldCount, setOneWeekOldCount] = useState<number>(0);
  const [twoWeekOldCount, setTwoWeekOldCount] = useState<number>(0);
  const [threeWeekOldCount, setThreeWeekOldCount] = useState<number>(0);

  const { isLoading, error, data } = useQuery<any>(
    ["publicationDates", searchKeyword],
    () => getDataBySearchAndDates(searchKeyword, oneMonthAgoDate, todaysDate)
  );
  const dataPublicationData = data?.hits.map(
    (job: any) => job.publication_date
  );

  const updateCounts = (dataPublicationData: string[]) => {
    let thisWeek = 0;
  let oneWeekOld = 0;
  let twoWeekOld = 0;
  let threeWeekOld = 0;

  dataPublicationData?.forEach((date: any) => {
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

  setThisWeekCount(thisWeek);
  setOneWeekOldCount(oneWeekOld);
  setTwoWeekOldCount(twoWeekOld);
  setThreeWeekOldCount(threeWeekOld);
}

  const handleFormSubmit = (e: any) => {
    console.log("submit")
    e.preventDefault();
    setSearchKeyword(e.target.searchTerm.value)
    updateCounts(dataPublicationData)
    updateJobsPerWeek(formId, searchKeyword, counts)
  };

  const counts: number[] = [
    threeWeekOldCount,
    twoWeekOldCount,
    oneWeekOldCount,
    thisWeekCount,
  ];

  useEffect(() => {
    updateCounts(dataPublicationData)
    updateJobsPerWeek(formId, searchKeyword, counts);
  }, [data, searchKeyword]);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error;

  return (
    <form className="m-10" onSubmit={handleFormSubmit} name="searchTerm1">
      <input
        type="text"
        name="searchTerm"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter search term"
        list="programmingLanguages"
      />
      <datalist id="programmingLanguages">
        <option value="javascript" />
        <option value="java" />
        <option value="python" />
      </datalist>
      <Button type="submit">Search</Button>
    </form>
  );
};

const DataVisualisation = () => {
  const [jobsPerWeekData, setJobsPerWeekData] = useState<any>({
    labels,
    datasets: [
      {
        id: 1,
        label: "javascript",
        data: [0, 0, 0, 0],
        borderColor: "rgb(229, 217, 217)",
        backgroundColor: "rgba(20, 144, 216, 0.5)",
      },
    ],
  });

  const { darkMode } = useThemeContext();

  const updateJobsPerWeek = (
    formId: number,
    searchKeyword: string,
    counts: number[]
  ) => {
    console.log("updatejobs called");

    setJobsPerWeekData((prevState: any) => {
      const foundDataSet = prevState.datasets.find(
        (dataset: any) => dataset.id === formId
      );
      if (foundDataSet) {
        const updatedDatasets = prevState.datasets.map((dataset: any) => {
          console.log("formId", formId);
          if (dataset.id === formId) {
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
      console.log("NEW? formId", formId);
      return {
        ...prevState,
        datasets: [
          ...prevState.datasets,
          {
            id: formId,
            label: searchKeyword,
            data: counts,
            borderColor: "rgb(25, 29, 54)",
            backgroundColor: "rgba(20, 144, 216, 0.5)",
          },
        ],
      };
    });
  };

  const [formArray, setFormArray] = useState<any[]>([
    <FormComponent
      updateJobsPerWeek={updateJobsPerWeek}
      formId={1}
    />,
  ]);

  const addNewForm = () => {
    const formId = Date.now();

    setFormArray([
      ...formArray,
      <FormComponent
        updateJobsPerWeek={updateJobsPerWeek}
        formId={formId}
      />,
    ]);
  };

  return (
    <div className={`pt-10  pb-96 ${darkMode ? "bg-[#97B2EF]" : "bg-Blue"}`}>
      {formArray.map((form: any, index) => {
        return <div key={index}>{form}</div>;
      })}
      <Button onClick={addNewForm}>Add Language</Button>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <JobsChart jobsPerWeekData={jobsPerWeekData} />
      </div>
    </div>
  );
};

export default DataVisualisation;
