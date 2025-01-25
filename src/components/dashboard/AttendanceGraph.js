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
      status: 'Present',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 8,
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
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-13T00:00:00.000Z' },
      status: 'Absent',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 0,
    },
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-14T00:00:00.000Z' },
      status: 'Present',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 8,
    },
    {
      inTime: { $date: '1970-01-01T00:00:00.000Z' },
      outTime: { $date: '1970-01-01T00:00:00.000Z' },
      date: { $date: '2024-12-15T00:00:00.000Z' },
      status: 'Absent',
      halfDay: false,
      shift: 'Day Shift',
      totalHours: 0,
    },
  ];

  // Extract the last six days of data
  const lastSixData = attendanceData.slice(-6);

  // Prepare labels (day names) for the x-axis
  const labels = lastSixData.map((entry) =>
    new Date(entry.date.$date).toLocaleDateString('en-US', { weekday: 'short' })
  );

  // Count Present and Absent for each day
  const presentData = lastSixData.map((entry) => (entry.status === 'Present' ? 1 : 0));
  const absentData = lastSixData.map((entry) => (entry.status === 'Absent' ? 1 : 0));

  // Prepare data for the bar chart
  const data = {
    labels, // Days of the week
    datasets: [
      {
        label: 'Present',
        data: presentData,
        backgroundColor: '#4CAF50', // Green color
      },
      {
        label: 'Absent',
        data: absentData,
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
