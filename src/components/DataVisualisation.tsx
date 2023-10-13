import React from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "../types/externalTypes";
import illu_precise from "../assets/illu_precise.svg";
import { useThemeContext } from "../theme";
import { useState } from "react";

interface PointProp {
  imgUrl: string;
  alt: string;
  header: string;
  text: string;
}

interface Positions {
  value: string;
}

const Point: React.FC<PointProp> = ({ imgUrl, alt, header, text }) => {
  return (
    <div className="grid grid-rows-7 p-4 w-full max-w-[400px] h-[300px] m-auto">
      <img
        src={imgUrl}
        alt={alt}
        className="rounded w-[240px] h-[240px] my-5 m-auto row-span-3"
      />
      <h3 className="mb-2 uppercase text-center font-bold">{header}</h3>
      <p className="text-base row-span-3">{text}</p>
    </div>
  );
};

const getData = async (programmingLanguage: string): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `https://jobsearch.api.jobtechdev.se/search?published-after=10000&q=${programmingLanguage}&offset=0&limit=5`
    );
    return response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const DataVisualisation = () => {
  const [numberOfPositions, setNumberOfPositions] = useState<Positions>({
    value: "",
  });

  const { darkMode } = useThemeContext();

  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => getData("java"),
  });

  console.log("some data", data);
  
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error;

  return (
    <div className={`pt-10  pb-96 ${darkMode ? "bg-[#97B2EF]" : "bg-Blue"}`}>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-auto">
        <Point
          imgUrl={illu_precise}
          alt="Point 1"
          header="Precise"
          text="hello"
        />
      </div>
    </div>
  );
};

export default DataVisualisation;
