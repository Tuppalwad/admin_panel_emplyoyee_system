import React from 'react';

const ProjectDetail = ({ project }) => {
  // Example dummy project data; replace with actual project data passed via props or fetched from an API
  const dummyProject = {
    title: 'Project Alpha',
    department: 'Development',
    manager: 'John Doe',
    priority: 'High',
    status: 'In Progress',
    startDate: '2024-08-01',
    endDate: '2024-12-01',
    description: 'This is a detailed description of Project Alpha, highlighting its goals, objectives, and deliverables. The project focuses on creating a new software solution that will enhance productivity and streamline business processes.',
    tasks: [
      { id: 1, task: 'Define project scope', status: 'Completed' },
      { id: 2, task: 'Set up initial team meeting', status: 'In Progress' },
      { id: 3, task: 'Develop project plan', status: 'Not Started' },
    ],
    teamMembers: ['Alice Johnson', 'Bob Brown', 'Charlie Davis'],
  };

  // Use the actual project data if provided, otherwise fallback to dummy data
  const projectData = project || dummyProject;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Project Details</h1>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{projectData.title}</h2>
          <p className="text-gray-600 mt-2">{projectData.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">General Information</h3>
            <p><strong>Department:</strong> {projectData.department}</p>
            <p><strong>Manager:</strong> {projectData.manager}</p>
            <p><strong>Priority:</strong> <span className={`font-semibold ${projectData.priority === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>{projectData.priority}</span></p>
            <p><strong>Status:</strong> {projectData.status}</p>
            <p><strong>Start Date:</strong> {projectData.startDate}</p>
            <p><strong>End Date:</strong> {projectData.endDate}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Team Members</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {projectData.teamMembers.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Tasks</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {projectData.tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.task}</strong> - {task.status}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => alert('Edit Project')}
          >
            Edit Project
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={() => alert('Delete Project')}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
