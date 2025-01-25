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
    labels: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    datasets: [
      {
        data: [
          projectData['Not Started'],
          projectData['In Progress'],
          projectData['Completed'],
          projectData['On Hold'],
          projectData['Cancelled'],
        ],
        backgroundColor: ['#FF6F61', '#FFCC00', '#4CAF50', '#2196F3', '#FFC107'],
        hoverBackgroundColor: ['#FF4C39', '#FFB300', '#45C45E', '#42A5F5', '#FFD54F'],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Project Status</h2>
      <div className="w-64 h-64"> {/* Set fixed size */}
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default ProjectStatusGraph;
