import React from 'react';
import { Bar } from 'react-chartjs-2';

const KeyMetricsGraph = () => {
  const data = {
    labels: ['January', 'February', 'March'], // Months
    datasets: [
      {
        label: 'Attendance (%)',
        data: [85, 90, 88],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Hours Worked',
        data: [160, 170, 155],
        backgroundColor: '#2196F3',
      },
      {
        label: 'Projects Completed',
        data: [2, 3, 1],
        backgroundColor: '#FFC107',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Key Metrics Over Time</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default KeyMetricsGraph;
