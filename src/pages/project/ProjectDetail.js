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

  const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

  return (
   
  <div className="min-h-screen bg-gray-100 p-4">
    <ToastContainer />

    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {projectData.projectTitle}
            </h1>

            <p className="text-sm text-gray-500 mt-1 max-w-3xl">
              {projectData.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate("/dashboard/project/add", {
                  state: { info: projectData },
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Edit Project
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              projectData.projectPriority
            )}`}
          >
            {projectData.projectPriority} Priority
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
              projectData.workStatus
            )}`}
          >
            {projectData.workStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Project Information
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Department</span>
              <span className="font-medium">{projectData.department}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Manager</span>
              <span className="font-medium">
                {projectData.manager
                  .map((manager) => manager.name)
                  .join(", ")}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Start Date</span>
              <span className="font-medium">
                {new Date(
                  projectData.projectStartDate
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">End Date</span>
              <span className="font-medium">
                {new Date(
                  projectData.projectEndDate
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Budget</span>
              <span className="font-bold text-green-600">
                ₹ {projectData.budget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information */}
        {projectData?.clientContact?.clientFullName && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Client Information
            </h2>

            <div className="space-y-2.5">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {projectData.clientContact.clientFullName}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">
                  {projectData.clientContact.email}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">
                  {projectData.clientContact.phone}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block mb-2">Address</span>
                <span className="font-medium">
                  {projectData.clientContact.address}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Team Members
          </h2>

          <div className="space-y-2">
            {projectData.teamMembers.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">
                    {member.role}
                  </p>
                </div>

                <span className="text-sm text-gray-600">
                  {member.empId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Documents
          </h2>

          <div className="space-y-2">
            {projectData.documents.map((doc) => (
              <a
                key={doc._id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 transition"
              >
                <p className="font-medium text-blue-600">
                  {doc.name}
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Uploaded on{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
  
};

export default ProjectDetail;
