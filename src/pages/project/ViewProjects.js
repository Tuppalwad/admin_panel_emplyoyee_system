import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProjects } from '../../redux/actions/projectAction';

const ViewProjects = () => {

  const dispatch = useDispatch();

  const { projects, refresh } = useSelector(state => state.projects)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProjects());
    }
    fetchData();

  }, [dispatch, refresh]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterItems = projects && projects?.filter((item) => item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">View Projects</h1> */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">View Projects</h1>
        <div
          className="flex items-center  p-1 w-1/3"
        >
          <p className="text-gray-600 ">Search:</p>
          <input
            type="text"
            placeholder="Search Project"
            className="p-2 border border-gray-300 rounded ml-2 w-full"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filterItems && filterItems.map((project) => (
          <div
            key={project._id}
            className="relative bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <button
              className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition-colors duration-200"
              onClick={() => alert(`Edit project ${project.projectTitle}`)}
            >
              ✏️
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {project.projectTitle}
            </h2>
            <p className="text-gray-600 mb-4">
              <strong>Department:</strong> {project.department}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Manager:</strong> {project.manager[0]?.empId}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Priority:</strong>{' '}
              <span
                className={`font-semibold ${project.projectPriority === 'High' ? 'text-red-500' : 'text-yellow-500'
                  }`}
              >
                {project.projectPriority}
              </span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Status:</strong> {project.workStatus}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Start Date:</strong> {new Date(project.projectStartDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>End Date:</strong> {new Date(project.projectEndDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {project.description}
            </p>
            <div className="flex items-center justify-between mt-4">
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                to={`/dashboard/project/projectDetail/${project._id}`}
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
