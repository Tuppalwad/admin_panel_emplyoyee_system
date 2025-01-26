import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProject, getProjectById } from '../../redux/actions/projectAction';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
const ProjectDetail = () => {
  const [projectData, setProjectData] = useState(null);
  const { id } = useParams();
  const notify = (message) => toast(message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(getProjectById({ projectId: id }));
      setProjectData(res.data);
    };
    fetchData();
  }, [dispatch, id]);

  if (!projectData) {
    return <p className="text-center text-gray-500">Project details not available</p>;
  }

  const handleDelete = async () => {
    // Show a confirmation dialog before proceeding with deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    if (!isConfirmed) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const res = await dispatch(deleteProject({ projectId: id }));
      if (res.status === "success") {
        notify('Project Deleted');
        navigate("/dashboard/project/view"); // Adjust the route according to your app's routing structure
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Project Details</h1>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        {/* Project Title and Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{projectData.projectTitle}</h2>
          <p className="text-gray-600 mt-2">{projectData.description}</p>
        </div>

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">General Information</h3>
            <p><strong>Department:</strong> {projectData.department}</p>
            <p>
              <strong>Manager:</strong> {projectData.manager.map((manager) => manager.role).join(', ')}
            </p>
            <p>
              <strong>Priority:</strong>{' '}
              <span
                className={`font-semibold ${projectData.projectPriority === 'High' ? 'text-red-500' : 'text-yellow-500'
                  }`}
              >
                {projectData.projectPriority}
              </span>
            </p>
            <p><strong>Status:</strong> {projectData.workStatus}</p>
            <p><strong>Start Date:</strong> {new Date(projectData.projectStartDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(projectData.projectEndDate).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> ₹ {projectData.budget.toLocaleString()}</p>
          </div>

          {/* Client Contact Information */}
          {projectData.clientContact && <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Client Contact</h3>
            <p><strong>Full Name:</strong> {projectData.clientContact.clientFullName}</p>
            <p><strong>Email:</strong> {projectData.clientContact.email}</p>
            <p><strong>Phone:</strong> {projectData.clientContact.phone}</p>
            <p><strong>Address:</strong> {projectData.clientContact.address}</p>
          </div>}

          {/* Team Members */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Team Members</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {projectData.teamMembers.map((member) => (
                <li key={member._id}>
                  {member.role} (ID: {member.empId}) Name:{member?.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Documents</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {projectData.documents.map((doc) => (
                <li key={doc._id}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {doc.name}
                  </a>{' '}
                  (Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => {
              navigate("/dashboard/project/add", { state: { info: projectData } });
            }}
          >
            Edit Project
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
