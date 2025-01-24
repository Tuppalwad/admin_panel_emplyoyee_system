import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectStatusGraph = () => {
  const data = {
    labels: ['Active', 'Completed', 'Pending'],
    datasets: [
      {
        data: [10, 25, 5], // Replace with actual counts
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
        hoverBackgroundColor: ['#45C45E', '#42A5F5', '#FFD54F'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Project Status</h2>
      <div className="w-64 h-64"> {/* Set fixed size */}
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default ProjectStatusGraph;
