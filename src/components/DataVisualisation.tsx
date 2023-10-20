import { useThemeContext } from "../theme";
import { useState } from "react";
import { Button } from "@mui/material";
import { JobsChart } from "./JobsChart";
import { FormComponent } from "./DataForm";

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

export const DataVisualisation = () => {
  const { darkMode } = useThemeContext();

  const [chartData, setChartData] = useState<any>({
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

  const updateChartData = (
    formId: number,
    searchKeyword: string,
    counts: number[]
  ) => {
    setChartData((prevState: ChartData) => {
      const foundDataSet = prevState.datasets.find(
        (dataset: Dataset) => dataset.id === formId
      );

      if (foundDataSet) {
        const updatedDatasets = prevState.datasets.map((dataset: Dataset) => {
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

  const [formArray, setFormArray] = useState([
    <FormComponent updateChartData={updateChartData} formId={1} />,
  ]);

  const addNewForm = () => {
    const formId = Date.now();

    setFormArray([
      ...formArray,
      <FormComponent updateChartData={updateChartData} formId={formId} />,
    ]);
  };

  return (
    <div className="max-w-[1000px] mx-auto my-5 flex flex-col flex-wrap gap-0.5 items-center justify-center">
      <div className={`max-w-[1000px] flex flex-wrap`}>
        {formArray.map((form: any, index) => {
          return <div key={index}>{form}</div>
        })}
      </div>
      <Button className="w-[415px] mx-5" onClick={addNewForm}>Add Language</Button>
      <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-10">
        <JobsChart chartData={chartData} />
      </div>
    </div>
  );
};
