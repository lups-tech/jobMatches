import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
import { useThemeContext } from "../theme";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { ChartExample } from "./ChartExample";

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

const FormComponent = ({
  jobsPerWeekData,
  setJobsPerWeekData,
  formId,
}: any) => {
  const todaysDate = new Date(Date.now()).toISOString().replace(/T.*/, "");
  const oneMonth = 2592000000;
  const oneMonthAgoDate = new Date(Date.now() - oneMonth)
    .toISOString()
    .replace(/T.*/, "");

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [oneWeekOldCount, setOneWeekOldCount] = useState<number>(0);
  const [twoWeekOldCount, setTwoWeekOldCount] = useState<number>(0);
  const [threeWeekOldCount, setThreeWeekOldCount] = useState<number>(0);

  const { isLoading, error, data } = useQuery<any>(
    ["publicationDates", searchKeyword],
    () => getDataBySearchAndDates(searchKeyword, oneMonthAgoDate, todaysDate)
  );
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setThisWeekCount(0);
    setOneWeekOldCount(0);
    setTwoWeekOldCount(0);
    setThreeWeekOldCount(0);
    setSearchKeyword(e.target.searchTerm.value);
  };

  const counts: number[] = [
    threeWeekOldCount,
    twoWeekOldCount,
    oneWeekOldCount,
    thisWeekCount,
  ];

    //  const index = jobsPerWeekData.dataset.findIndex((dataset: any) => dataset.id === thisFormId)

  useEffect(() => {
    const dataPublicationData = data?.hits.map(
      (job: any) => job.publication_date
    );
    dataPublicationData?.forEach((date: any) => {
      const timeDiff = Date.now() - new Date(date).getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if (days < 8) {
        setThisWeekCount((prev) => prev + 1);
      }
      if (days >= 8 && days < 15) {
        setOneWeekOldCount((prev) => prev + 1);
      }
      if (days >= 15 && days < 22) {
        setTwoWeekOldCount((prev) => prev + 1);
      }
      if (days >= 22 && days < 29) {
        setThreeWeekOldCount((prev) => prev + 1);
      }
    });
  }, [data, searchKeyword]);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error;

  return (
    <form className="m-10" onSubmit={handleFormSubmit} name="searchTerm1">
      <input
        type="text"
        name="searchTerm"
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
    ],
  });

  const { darkMode } = useThemeContext();

  const [formArray, setFormArray] = useState<any[]>([]);

  const addNewFormAndDataset = () => {
    const formId = Date.now();
  
    setJobsPerWeekData((prevState: any) => {
      const newDataset = {
        id: formId,
        label: "",
        data: [0, 0, 0, 0],
        borderColor: "rgb(229, 217, 217)",
        backgroundColor: "rgba(20, 144, 216, 0.5)",
      };
  
      // Create a new array with the existing datasets and the new dataset
      const newDatasets = [...prevState.datasets, newDataset];
  
      // Return a new state with the updated datasets
      return {
        ...prevState,
        datasets: newDatasets,
      };
    });

  
    setFormArray([
      ...formArray,
      <FormComponent
        jobsPerWeekData={jobsPerWeekData}
        setJobsPerWeekData={setJobsPerWeekData}
        formId={formId}
      />,
    ]);
  };

  return (
    <div className={`pt-10  pb-96 ${darkMode ? "bg-[#97B2EF]" : "bg-Blue"}`}>
      {formArray.map((form: any, index) => {
        return <div key={index}>{form}</div>;
      })}
      <Button onClick={addNewFormAndDataset}>Add Language</Button>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <ChartExample jobsPerWeekData={jobsPerWeekData} />
      </div>
    </div>
  );
};

export default DataVisualisation;
