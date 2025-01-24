import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttendanceGraph = () => {
  const attendanceData = [
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-10T00:00:00.000Z' },
      status: 'Absent',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 0,
    },
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-11T00:00:00.000Z' },
      status: 'Absent',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 0,
    },
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-12T00:00:00.000Z' },
      status: 'Leave',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 0,
    },
  ];
  const lastSixData = attendanceData.slice(-6);

  // Prepare data for the bar chart
  const labels = lastSixData.map((entry) =>
    new Date(entry.date.$date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  );

  const presentCount = lastSixData.filter((entry) => entry.status === 'Present').length;
  const absentCount = lastSixData.filter((entry) => entry.status === 'Absent').length;

  const data = {
    labels: ['Last 6 Days'], // Single bar group
    datasets: [
      {
        label: 'Present',
        data: [presentCount],
        backgroundColor: '#4CAF50', // Green color
      },
      {
        label: 'Absent',
        data: [absentCount],
        backgroundColor: '#F44336', // Red color
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
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary (Last 6 Days)</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AttendanceGraph;
