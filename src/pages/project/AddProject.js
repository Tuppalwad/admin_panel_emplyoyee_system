import React, { useState } from 'react';
import { DropdownBox, TextInput, Loading } from '../../components/common';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { setEmployee } from '../../redux/actions/employeeActions';

const AddProject = () => {
  const [isClientProject, setIsClientProject] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    projectTitle: '',
    department: '',
    projectPriority: '',
    clientFullName: '',
    price: '',
    projectStartDate: '',
    projectEndDate: '',
    manager: '',
    teamMembers: [],
    description: '',
    workStatus: '',
    clientNumber: '',
    clientEmail: '',
    clientAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const notify = (message) => toast(message);

  // Example employee list array
  const employeeList = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis']; // Replace with actual data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTeamMemberSelect = (selectedMember) => {
    if (!formData.teamMembers.includes(selectedMember)) {
      setFormData((prevData) => ({
        ...prevData,
        teamMembers: [...prevData.teamMembers, selectedMember],
      }));
      setErrors((prevErrors) => ({ ...prevErrors, teamMembers: '' }));
    }
  };

  const handleRemoveTeamMember = (memberToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: prevData.teamMembers.filter((member) => member !== memberToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = 'Project ID is required';
    if (!formData.projectTitle) newErrors.projectTitle = 'Project Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.projectPriority) newErrors.projectPriority = 'Project Priority is required';
    if (!formData.clientFullName) newErrors.clientFullName = 'Client Name is required';
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (!/^\d+$/.test(formData.price)) {
      newErrors.price = 'Price must be a valid integer';
    }
    if (!formData.projectStartDate) newErrors.projectStartDate = 'Project Start Date is required';
    if (!formData.projectEndDate) newErrors.projectEndDate = 'Project End Date is required';
    else if (new Date(formData.projectEndDate) <= new Date(formData.projectStartDate)) {
      newErrors.projectEndDate = 'End Date must be after the Start Date';
    }
    if (!formData.manager) newErrors.manager = 'Manager selection is required';
    if (!formData.teamMembers.length) newErrors.teamMembers = 'At least one team member must be selected';
    if (!formData.workStatus) newErrors.workStatus = 'Work Status is required';
    if (!formData.description) newErrors.description = 'Description is required';

    if (isClientProject) {
      if (!formData.clientNumber) newErrors.clientNumber = 'Client Number is required';
      if (!formData.clientEmail) newErrors.clientEmail = 'Client Email is required';
      if (!formData.clientAddress) newErrors.clientAddress = 'Client Address is required';
    }


    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        // Submit form data to backend
        const res = await dispatch(setEmployee(formData));

        if (res.code === 200) {
          notify('Project Added Successfully');
          setFormData({
            projectId: '',
            projectTitle: '',
            department: '',
            projectPriority: '',
            clientFullName: '',
            price: '',
            projectStartDate: '',
            projectEndDate: '',
            manager: '',
            teamMembers: [],
            description: '',
            workStatus: '',
            clientNumber: '',
            clientEmail: '',
            clientAddress: '',
          });
        } else {
          notify(res.message);
        }
      } catch (error) {
        notify('Error adding project');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />
      {loading && <Loading />}
      <h1 className="text-2xl font-bold mb-6 mt-3 text-gray-800">Add Project</h1>
      <div className="mb-4 flex items-center">
        <label className="block text-gray-700 text-sm font-bold">
          Is this a client project ?
        </label>
        <input
          type="checkbox"
          className=" ml-2"
          checked={isClientProject}
          onChange={() => setIsClientProject(!isClientProject)}
        />
        <span className="text-gray-700 ms-2">Yes</span>
      </div>


      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-md rounded-lg">
        <TextInput
          name="projectId"
          label="Project ID"
          type="text"
          placeholder="Project ID*"
          value={formData.projectId}
          onChange={handleChange}
          error={errors.projectId}
        />

        <TextInput
          name="projectTitle"
          label="Project Title"
          type="text"
          placeholder="Project Title*"
          value={formData.projectTitle}
          onChange={handleChange}
          error={errors.projectTitle}
        />

        <DropdownBox
          name="department"
          label="Department"
          placeholder="Department*"
          options={['Designing', 'Development', 'Testing', 'Marketing', 'Accounts']}
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
        />

        <DropdownBox
          name="projectPriority"
          label="Project Priority"
          placeholder="Project Priority*"
          options={['Low', 'Medium', 'High']}
          value={formData.projectPriority}
          onChange={handleChange}
          error={errors.projectPriority}
        />

        {isClientProject && <>
          <TextInput
            name="clientFullName"
            label="Client Full Name"
            type="text"
            placeholder="Client Full Name*"
            value={formData.clientFullName}
            onChange={handleChange}
            error={errors.clientFullName}
          />

          <TextInput
            name="clientNumber"
            label="Client Contact Number"
            type="text"
            placeholder="Client Contact Number*"
            value={formData.clientNumber}
            onChange={handleChange}
            error={errors.clientNumber}
          />
          <TextInput
            name="clientEmail"
            label="Client Email"
            type="text"
            placeholder="Client Email*"
            value={formData.clientEmail}
            onChange={handleChange}
            error={errors.clientEmail}
          />

          <TextInput
            name="clientAddress"
            label="Client Address"
            type="text"
            placeholder="Client Address*"
            value={formData.clientAddress}
            onChange={handleChange}
            error={errors.clientAddress}
          />
        </>}

        <TextInput
          name="price"
          label="Price"
          type="text"
          placeholder="Price*"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
        />

        <TextInput
          name="projectStartDate"
          label="Project Start Date"
          type="date"
          placeholder="Project Start Date"
          value={formData.projectStartDate}
          onChange={handleChange}
          error={errors.projectStartDate}
        />


        <TextInput
          name="projectEndDate"
          label="Project End Date"
          type="date"
          placeholder="Project End Date"
          value={formData.projectEndDate}
          onChange={handleChange}
          error={errors.projectEndDate}
        />

        <DropdownBox
          name="manager"
          label="Manager"
          placeholder="Select Manager*"
          options={['Manager 1', 'Manager 2', 'Manager 3']} // Replace with actual manager names or data
          value={formData.manager}
          onChange={handleChange}
          error={errors.manager}
        />

        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teamMembers">
            Select Team Members
          </label>
          <div className="mb-4">
            {formData.teamMembers.map((member, index) => (
              <span key={index} className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {member}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveTeamMember(member)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <select
            className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors.teamMembers ? 'border-red-500' : 'border-gray-300'}`}
            value=""
            onChange={(e) => handleTeamMemberSelect(e.target.value)}
          >
            <option value="" disabled>Select team members</option>
            {employeeList
              .filter((employee) => !formData.teamMembers.includes(employee))
              .map((employee, index) => (
                <option key={index} value={employee}>
                  {employee}
                </option>
              ))}
          </select>
          {errors.teamMembers && <p className="text-red-500 text-xs italic">{errors.teamMembers}</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description*
          </label>
          <textarea
            className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            name="description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>

        <DropdownBox
          name="workStatus"
          label="Work Status"
          placeholder="Work Status*"
          options={['New', 'In Progress', 'Completed']}
          value={formData.workStatus}
          onChange={handleChange}
          error={errors.workStatus}
        />

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
