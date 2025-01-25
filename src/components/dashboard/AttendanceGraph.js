import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useDispatch } from 'react-redux';
import { getDashboardAttendance } from '../../redux/actions/dashboardAction';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttendanceGraph = () => {
  // Initialize graphData with default values
  const [graphData, setGraphData] = useState({
    DayOne: { absentCount: 0, presentCount: 0 },
    DayTwo: { absentCount: 0, presentCount: 0 },
    DayThree: { absentCount: 0, presentCount: 0 },
    DayFour: { absentCount: 0, presentCount: 0 },
    DayFive: { absentCount: 0, presentCount: 0 },
    DaySix: { absentCount: 0, presentCount: 0 },
  });

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      // Fetch attendance data using the dispatch action
      const res = await dispatch(getDashboardAttendance());
      console.log(res.data, 'API Response');

      // Assuming the response structure matches this format
      if (res.status === "success") {
        const transformedData = res.data;
        setGraphData({
          DayOne: transformedData.DayOne || { absentCount: 0, presentCount: 0 },
          DayTwo: transformedData.DayTwo || { absentCount: 0, presentCount: 0 },
          DayThree: transformedData.DayThree || { absentCount: 0, presentCount: 0 },
          DayFour: transformedData.DayFour || { absentCount: 0, presentCount: 0 },
          DayFive: transformedData.DayFive || { absentCount: 0, presentCount: 0 },
          DaySix: transformedData.DaySix || { absentCount: 0, presentCount: 0 },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Prepare labels (day names) for the x-axis
  const labels = Object.keys(graphData);

  // Count Present and Absent for each day
  const presentData = labels.map((day) => graphData[day].presentCount);
  const absentData = labels.map((day) => graphData[day].absentCount);

  // Prepare data for the bar chart
  const chartData = {
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
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AttendanceGraph;
