import React from 'react';
import { Bar } from 'react-chartjs-2';

const TeamProductivityGraph = () => {
  const data = {
    labels: ['Team A', 'Team B', 'Team C'], // Replace with team names
    datasets: [
      {
        label: 'Tasks Completed',
        data: [15, 20, 10],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Hours Worked',
        data: [120, 140, 90],
        backgroundColor: '#2196F3',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Team Productivity</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TeamProductivityGraph;
