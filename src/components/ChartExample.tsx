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



export const ChartExample = ({ jobsPerWeek }: any) => {
    console.log(jobsPerWeek)
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: "Chart.js Line Chart",
          },
        },
      };
      
      const labels = [
        "January",
        "February",
        "March",
      ];
      
      const data = {
        labels,
        datasets: [
          {
            label: "Dataset 1",
            data: jobsPerWeek,
            borderColor: "rgb(46, 73, 93)",
            backgroundColor: "rgba(83, 173, 224, 0.5)",
          },
        ],
      };
  return (
    <>
      <Line options={options} data={data} />;
    </>
  );
};
