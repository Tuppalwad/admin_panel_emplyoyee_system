import React from 'react';
import { Bar } from 'react-chartjs-2';

const KeyMetricsGraph = () => {
  const attendance = [85, 90, 88];
  const hoursWorked = [160, 170, 155];
  const projectsCompleted = [2, 3, 1];

  const avgAttendance = Math.round(
    attendance.reduce((a, b) => a + b, 0) / attendance.length
  );

  const totalHours = hoursWorked.reduce((a, b) => a + b, 0);

  const totalProjects = projectsCompleted.reduce((a, b) => a + b, 0);

  const data = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Attendance (%)',
        data: attendance,
        backgroundColor: '#22c55e',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Hours Worked',
        data: hoursWorked,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Projects Completed',
        data: projectsCompleted,
        backgroundColor: '#f59e0b',
        borderRadius: 8,
        borderSkipped: false,
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
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 12,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: '#f1f5f9',
        },

        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Key Metrics Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Monthly performance summary
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <i className="fas fa-chart-line text-purple-600 text-xl"></i>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm font-medium text-green-600">
            Avg Attendance
          </p>

          <h3 className="text-3xl font-bold text-green-700 mt-2">
            {avgAttendance}%
          </h3>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-600">
            Total Hours
          </p>

          <h3 className="text-3xl font-bold text-blue-700 mt-2">
            {totalHours}
          </h3>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-sm font-medium text-yellow-600">
            Projects Completed
          </p>

          <h3 className="text-3xl font-bold text-yellow-700 mt-2">
            {totalProjects}
          </h3>
        </div>

      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-3 gap-3 mt-6">

        <div className="text-center bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">
            Best Attendance
          </p>

          <h4 className="font-bold text-green-600">
            {Math.max(...attendance)}%
          </h4>
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">
            Max Hours
          </p>

          <h4 className="font-bold text-blue-600">
            {Math.max(...hoursWorked)}
          </h4>
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">
            Best Month
          </p>

          <h4 className="font-bold text-orange-600">
            February
          </h4>
        </div>

      </div>
    </div>
  );
};

export default KeyMetricsGraph;