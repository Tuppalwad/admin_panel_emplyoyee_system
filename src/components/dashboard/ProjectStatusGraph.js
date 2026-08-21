import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import { getDashboardProject } from '../../redux/actions/dashboardAction';

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectStatusGraph = () => {
  const [projectData, setProjectData] = useState({
    'Not Started': 0,
    'In Progress': 0,
    'Completed': 0,
    'On Hold': 0,
    'Cancelled': 0,
  });

  const dispatch = useDispatch();

  // Fetch data from the API
  const getData = async () => {
    try {
      const res = await dispatch(getDashboardProject());
      if (res.status === "success") {
        // Map the API response data to the projectData state
        const newData = res.data.reduce((acc, { status, count }) => {
          acc[status] = count; // Assign counts based on the status
          return acc;
        }, {});
        setProjectData(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Prepare the data for the Doughnut chart
  const data = {
  labels: [
    'Not Started',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
  ],
  datasets: [
    {
      data: [
        projectData['Not Started'] || 0,
        projectData['In Progress'] || 0,
        projectData['Completed'] || 0,
        projectData['On Hold'] || 0,
        projectData['Cancelled'] || 0,
      ],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#22c55e',
        '#3b82f6',
        '#6b7280',
      ],
      borderWidth: 0,
      hoverOffset: 12,
    },
  ],
};
const totalProjects =
  Object.values(projectData).reduce((sum, count) => sum + count, 0);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 10,
    },
  },
};
 return (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4">

    {/* Header */}
    <div className="flex justify-between items-center mb-3">
      <div>
        <h2 className="text-base font-bold text-gray-800">
          Project Status
        </h2>

        <p className="text-xs text-gray-500 mt-0.5">
          Overall project progress overview
        </p>
      </div>

      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
        <i className="fas fa-project-diagram text-blue-600 text-sm"></i>
      </div>
    </div>

    {/* Chart */}
    <div className="relative h-[150px] flex justify-center items-center">

      <Doughnut data={data} options={options} />

      <div className="absolute text-center">
        <p className="text-xs text-gray-500">
          Total Projects
        </p>

        <h3 className="text-2xl font-bold text-gray-800">
          {totalProjects}
        </h3>
      </div>

    </div>

    {/* Status Summary */}
    <div className="grid grid-cols-2 gap-2 mt-3">

      <div className="flex items-center justify-between bg-red-50 rounded-xl p-3">
        <div>
          <p className="text-xs text-red-600">
            Not Started
          </p>

          <h4 className="font-bold text-red-700">
            {projectData['Not Started'] || 0}
          </h4>
        </div>

        <span className="w-3 h-3 rounded-full bg-red-500"></span>
      </div>

      <div className="flex items-center justify-between bg-yellow-50 rounded-xl p-3">
        <div>
          <p className="text-xs text-yellow-700">
            In Progress
          </p>

          <h4 className="font-bold text-yellow-700">
            {projectData['In Progress'] || 0}
          </h4>
        </div>

        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
      </div>

      <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
        <div>
          <p className="text-xs text-green-700">
            Completed
          </p>

          <h4 className="font-bold text-green-700">
            {projectData['Completed'] || 0}
          </h4>
        </div>

        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      </div>

      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
        <div>
          <p className="text-xs text-blue-700">
            On Hold
          </p>

          <h4 className="font-bold text-blue-700">
            {projectData['On Hold'] || 0}
          </h4>
        </div>

        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
      </div>

    </div>

    {/* Cancelled */}
    <div className="mt-3 bg-gray-50 rounded-xl p-3 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-600">
          Cancelled
        </p>

        <h4 className="font-bold text-gray-700">
          {projectData['Cancelled'] || 0}
        </h4>
      </div>

      <span className="w-3 h-3 rounded-full bg-gray-500"></span>
    </div>

  </div>
);
};

export default ProjectStatusGraph;
