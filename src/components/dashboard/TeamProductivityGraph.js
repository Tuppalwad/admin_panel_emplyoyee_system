import React from 'react';
import { Bar } from 'react-chartjs-2';

const TeamProductivityGraph = () => {
  const teams = ['Team A', 'Team B', 'Team C'];

  const tasksCompleted = [15, 20, 10];
  const hoursWorked = [120, 140, 90];

  const totalTasks = tasksCompleted.reduce((a, b) => a + b, 0);
  const totalHours = hoursWorked.reduce((a, b) => a + b, 0);

  const data = {
    labels: teams,

    datasets: [
      {
        label: 'Tasks Completed',
        data: tasksCompleted,
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Team Productivity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Performance overview by team
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <i className="fas fa-users text-indigo-600 text-xl"></i>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-600 font-medium">
            Teams
          </p>

          <h3 className="text-3xl font-bold text-blue-700 mt-2">
            {teams.length}
          </h3>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm text-green-600 font-medium">
            Tasks Completed
          </p>

          <h3 className="text-3xl font-bold text-green-700 mt-2">
            {totalTasks}
          </h3>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-sm text-purple-600 font-medium">
            Hours Worked
          </p>

          <h3 className="text-3xl font-bold text-purple-700 mt-2">
            {totalHours}
          </h3>
        </div>

      </div>

      {/* Chart */}
      <div className="h-[380px]">
        <Bar data={data} options={options} />
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">

        {teams.map((team, index) => (
          <div
            key={team}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <h4 className="font-semibold text-gray-800">
              {team}
            </h4>

            <div className="mt-3 space-y-2">

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Tasks
                </span>

                <span className="font-medium text-green-600">
                  {tasksCompleted[index]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Hours
                </span>

                <span className="font-medium text-blue-600">
                  {hoursWorked[index]}
                </span>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TeamProductivityGraph;