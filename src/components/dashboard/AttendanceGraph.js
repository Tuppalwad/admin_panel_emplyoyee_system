import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AttendanceGraph = ({ attendanceData }) => {
  // Process the attendance data
  const labels = attendanceData.map((entry) =>
    new Date(entry.date.$date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  );

  const statusValues = attendanceData.map((entry) => {
    if (entry.status === 'Present') return 1; // Mark 1 for Present
    if (entry.status === 'Half Day') return 0.5; // Mark 0.5 for Half Day
    if (entry.status === 'Absent') return 0; // Mark 0 for Absent
    if (entry.status === 'Leave') return -1; // Mark -1 for Leave
    return 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Attendance Trends',
        data: statusValues,
        borderColor: '#4F46E5', // Indigo color
        backgroundColor: 'rgba(79, 70, 229, 0.2)', // Light Indigo
        tension: 0.4, // Smooth curves
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            if (value === 1) return 'Present';
            if (value === 0.5) return 'Half Day';
            if (value === 0) return 'Absent';
            if (value === -1) return 'Leave';
            return 'Unknown';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value === 1) return 'Present';
            if (value === 0.5) return 'Half Day';
            if (value === 0) return 'Absent';
            if (value === -1) return 'Leave';
            return value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Dates',
          color: '#6B7280', // Gray
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Attendance Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AttendanceGraph;
