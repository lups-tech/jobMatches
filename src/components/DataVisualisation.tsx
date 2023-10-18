import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
import { useThemeContext } from "../theme";
import { useState, useEffect } from "react";
import { Button } from '@mui/material';
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

const DataVisualisation = () => {
  const { darkMode } = useThemeContext();

  const [searchKeyword, setSearchKeyword] = useState<string>("")

  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [oneWeekOldCount, setOneWeekOldCount] = useState<number>(0);
  const [twoWeekOldCount, setTwoWeekOldCount] = useState<number>(0);
  const [threeWeekOldCount, setThreeWeekOldCount] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)

  const { isLoading, error, data } = useQuery<any>(["publicationDates", searchKeyword],  () =>
    getDataBySearchAndDates(searchKeyword, "2023-09-10", "2023-10-18")
  );
  
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setThisWeekCount(0)
    setOneWeekOldCount(0)
    setTwoWeekOldCount(0)
    setThreeWeekOldCount(0)
    setSearchKeyword(e.target.searchTerm.value);
  };

  useEffect(() => {
    setIsLoadingData(true)
      const dataPublicationData = data?.hits.map((job: any) => job.publication_date);
      dataPublicationData?.forEach((date: any) => {
        const timeDiff = Date.now() - new Date(date).getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (days < 8) {
          setThisWeekCount(prev => prev + 1);
        }
        if (days >= 8 && days < 15) {
          setOneWeekOldCount(prev => prev + 1);
        }
        if (days >= 15 && days < 22) {
          setTwoWeekOldCount(prev => prev + 1);
        }
        if (days >= 22 && days < 29) {
          setThreeWeekOldCount(prev => prev +1)
        }
      });
      setIsLoadingData(false)
  }, [data, searchKeyword]);
  

  const counts: number[] = [threeWeekOldCount, twoWeekOldCount, oneWeekOldCount, thisWeekCount];
  const counstsTwo: number[] = [5, 5, 20, 56]

  const labels = [
    "3-4 weeks ago",
    "2-3 weeks ago",
    "1-2 weeks ago",
    "Last week",
  ];

  const jobsPerWeekData = {
    labels,
    datasets: [
      {
        label: searchKeyword,
        data: counts,
        borderColor: "rgb(46, 73, 93)",
        backgroundColor: "rgba(83, 173, 224, 0.5)",
      },
      {
        label: "JavaScript",
        data: counstsTwo,
        borderColor: "rgb(55, 94, 80)",
        backgroundColor: "rgba(103, 175, 161, 0.5)",
      },
    ],
  };

  if (isLoading || isLoadingData) return "Loading...";

  if (error) return "An error has occurred: " + error;

  return (
    <div className={`pt-10  pb-96 ${darkMode ? "bg-[#97B2EF]" : "bg-Blue"}`}>
      <form className="m-10" onSubmit={handleFormSubmit}>
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
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <ChartExample jobsPerWeekData={jobsPerWeekData} />
      </div>
    </div>
  );
};

export default DataVisualisation;
