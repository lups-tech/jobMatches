import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
// import { useThemeContext } from "../theme";
import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";

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

type FormProps = {
    updateChartData: Function, 
    formId: number
}

export const FormComponent = ({ updateChartData, formId }: FormProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const todaysDate = new Date(Date.now()).toISOString().replace(/T.*/, "");
  const oneMonth = 2592000000;
  const oneMonthAgoDate = new Date(Date.now() - oneMonth)
    .toISOString()
    .replace(/T.*/, "");

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { isLoading, error, data } = useQuery<SearchResult>(
    ["publicationDates", searchKeyword],
    () => getDataBySearchAndDates(searchKeyword, oneMonthAgoDate, todaysDate)
  );
  const dataPublicationData = data?.hits.map(
    (job) => job.publication_date
  );

  const [thisWeekCount, setThisWeekCount] = useState<number>(0);

  const [jobsPerWeekCounts, setJobsPerWeekCounts] = useState<number[]>([
    0, 0, 0, 0,
  ]);

  const updateCounts = (dataPublicationData: string[] | undefined) => {
    let thisWeek = 0;
    let oneWeekOld = 0;
    let twoWeekOld = 0;
    let threeWeekOld = 0;

    dataPublicationData?.forEach((date) => {
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
    setJobsPerWeekCounts([threeWeekOld, twoWeekOld, oneWeekOld, thisWeek]);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    setSearchKeyword(form.searchTerm.value);
  };

  useEffect(() => {
    if (searchKeyword) {
      updateCounts(dataPublicationData);
      updateChartData(formId, searchKeyword, jobsPerWeekCounts);
    }
  }, [searchKeyword, thisWeekCount, data]);

  if (isLoading) return (
    <div className="flex justify-center mt-16">
      <CircularProgress/>
    </div>
  );

  if (error) return "An error has occurred: " + error;

  return (
    <form className="m-5 flex p-2" onSubmit={handleFormSubmit} name="searchTerm1">
      <input
        type="text"
        name="searchTerm"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter search term"
        list="programmingLanguages"
        className="m-2 p-3 rounded-lg"
      />
      <Button variant="outlined" type="submit" className="w-full" sx={{
        backgroundColor: "#f5f5f5",
        color: "#808080"
      }}>
        Search
      </Button>
    </form>
  );
};
