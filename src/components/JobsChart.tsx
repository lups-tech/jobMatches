import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export const JobsChart = ({ jobsPerWeekData }: any) => {
  
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: "Programming languages job postings by week",
          },
        },
      };
      
  return (
    <>
      <Line options={options} data={jobsPerWeekData} />;
    </>
  );
};
