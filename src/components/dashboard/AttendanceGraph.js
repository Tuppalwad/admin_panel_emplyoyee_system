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

  const totalPresent = presentData.reduce((a, b) => a + b, 0);
  const totalAbsent = absentData.reduce((a, b) => a + b, 0);

  // Prepare data for the bar chart
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Present',
        data: presentData,
        backgroundColor: '#22c55e',
        // borderRadius: 8,
        borderSkipped: false,
        barThickness: 22,
      },
      {
        label: 'Absent',
        data: absentData,
        backgroundColor: '#ef4444',
        // borderRadius: 8,
        borderSkipped: false,
        barThickness: 22,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 13,
            weight: '600',
          },
        },
      },

      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderWidth: 0,
        cornerRadius: 10,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
        },
      },

      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            Attendance Analytics
          </h2>

          <p className="text-xs text-gray-500 mt-0.5">
            Employee attendance for last 6 working days
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
          <i className="fas fa-chart-bar text-green-600 text-sm"></i>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-green-700 font-medium">
            Total Present
          </p>

          <h3 className="text-xl font-bold text-green-600 mt-1">
            {totalPresent}
          </h3>
        </div>

        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <p className="text-xs text-red-700 font-medium">
            Total Absent
          </p>

          <h3 className="text-xl font-bold text-red-600 mt-1">
            {totalAbsent}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[190px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AttendanceGraph;
