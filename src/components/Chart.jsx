import React from "react";
import { Line } from "react-chartjs-2";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ data, options = {} }) => {
  // Provide default data if none is provided
  const defaultData = {
    labels: [],
    datasets: [],
  };

  const chartData = data || defaultData;

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    // Let Chart.js infer the x-axis type from labels (category scale)
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    ...options,
  };

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <Line data={chartData} options={defaultOptions} />
    </div>
  );
};

export default Chart;
