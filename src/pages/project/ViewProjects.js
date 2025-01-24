import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ViewProjects = () => {
  // Dummy project data
  const [projects] = useState([
    {
      id: 1,
      title: 'Project Alpha',
      department: 'Development',
      manager: 'John Doe',
      priority: 'High',
      status: 'In Progress',
      startDate: '2024-08-01',
      endDate: '2024-12-01',
      description: 'This is a detailed description of Project Alpha.',
    },
    {
      id: 2,
      title: 'Project Beta',
      department: 'Marketing',
      manager: 'Jane Smith',
      priority: 'Medium',
      status: 'New',
      startDate: '2024-09-01',
      endDate: '2024-11-15',
      description: 'This is a detailed description of Project Beta.',
    },
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">View Projects</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="relative bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <button
              className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition-colors duration-200"
              onClick={() => alert(`Edit project ${project.title}`)}
            >
              ✏️
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">
              <strong>Department:</strong> {project.department}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Manager:</strong> {project.manager}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Priority:</strong> <span className={`font-semibold ${project.priority === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>{project.priority}</span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Status:</strong> {project.status}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Start Date:</strong> {project.startDate}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>End Date:</strong> {project.endDate}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {project.description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                to={`/dashboard/project/projectDetail/${project.id}`}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProjects;
