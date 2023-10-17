import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
import { useThemeContext } from "../theme";
import { useState, useEffect, SetStateAction } from "react";
import { Button } from '@mui/material';
import { ChartExample } from "./ChartExample";
import { useSubmit } from "react-router-dom";

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
  const [searchKeyword, setSearchKeyword] = useState<string>("javascript")
  const [thisWeekCount, setThisWeekCount] = useState<number>(0);
  const [oneWeekOldCount, setOneWeekOldCount] = useState<number>(0);
  const [twoWeekOldCount, setTwoWeekOldCount] = useState<number>(0);

  const { isLoading, error, data } = useQuery<any>(["publicationDates"], () =>
    getDataBySearchAndDates(searchKeyword, "2023-01-01", "2023-10-16")
  );
  
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    // You can add validation or additional logic here
    // For simplicity, we set the searchKeyword to the input value directly
    setSearchKeyword(e.target.searchTerm.value);
  };

  useEffect(() => {
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
      });
    
  }, [data, searchKeyword]);
  

  const counts: number[] = [twoWeekOldCount, oneWeekOldCount, thisWeekCount];

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error;
  console.log(searchKeyword)

  return (
    <div className={`pt-10  pb-96 ${darkMode ? "bg-[#97B2EF]" : "bg-Blue"}`}>
      <form className="m-10" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="searchTerm"
          placeholder="Enter search term"
        />
        <Button type="submit">Search</Button>
      </form>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <ChartExample jobsPerWeek={counts} />
      </div>
    </div>
  );
};

export default DataVisualisation;
