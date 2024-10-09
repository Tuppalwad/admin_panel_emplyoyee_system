import React, { useEffect, useState } from 'react';
import { DropdownBox, TextInput, Loading } from '../../components/common';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getAllEmployees, setEmployee } from '../../redux/actions/employeeActions';
import { validatedata } from './validate';
import { createProject, getManagerList } from '../../redux/actions/projectAction';
import DropdownBoxTeam from './DropdownBoxTeam';


const AddProject = () => {
  const [isClientProject, setIsClientProject] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    department: '',
    projectPriority: '',
    clientFullName: '',
    budget: '',
    projectStartDate: '',
    projectEndDate: '',
    manager: [],
    teamMembers: [],
    description: '',
    workStatus: '',
    clientNumber: '',
    clientEmail: '',
    clientAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [listOfManager, setListOfManager] = useState([])
  const dispatch = useDispatch();

  const { allEmployees } = useSelector(state => state.employee)
  const { listOfManager } = useSelector(state => state.projects)

  console.log(listOfManager);

  const getManagers = async () => {
    await dispatch(getManagerList())
  }
  useEffect(() => {
    const fetchEmployees = async () => {
      await dispatch(getAllEmployees());
    }
    fetchEmployees();
    getManagers();
  }, [])


  const managerlist = [{
    "name": "Rajesh tuppalwad",
    "empId": "EMP2058",
    "role": "MANAGER"
  },
  {
    "name": "Ganesh tuppalwad",
    "empId": "EMP2054",
    "role": "MANAGER"
  },
  {
    "name": "Pavan tuppalwad",
    "empId": "EMP2038",
    "role": "MANAGER"
  }
  ]
  const empList = allEmployees.map((item) => ({ name: item.fullName, empId: item.empId, role: item.role }));


  const notify = (message) => toast(message);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTeamMemberSelect = (selectedMember) => {
    console.log(selectedMember)
    const check = formData.teamMembers.find((member) => member.empId === selectedMember.empId);
    if (!check) {
      setFormData((prevData) => ({
        ...prevData,
        teamMembers: [...prevData.teamMembers, selectedMember],
      }));
    } else {
      notify('Team member already added');
    }
  };

  // Handle removing a selected team member
  const handleRemoveTeamMember = (memberToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: prevData.teamMembers.filter(
        (member) => member.empId !== memberToRemove
      ),
    }));
  };

  const handleManagerSelect = (selectedMember) => {
    const check = formData.manager.find((member) => member.empId === selectedMember.empId);
    if (!check) {
      setFormData((prevData) => ({
        ...prevData,
        manager: [...prevData.manager, selectedMember],
      }));
    } else {
      notify('Team member already added');
    }
  };

  // Handle removing a selected team member
  const handleRemoveManager = (memberToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      manager: prevData.manager.filter(
        (member) => member.empId !== memberToRemove
      ),
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validatedata(formData, isClientProject);
    if (Object.keys(newErrors).length > 0) {
      console.log('error', newErrors)
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        // Submit form data to backend
        const res = await dispatch(createProject(formData));

        if (res.code === 200) {
          setFormData({
            projectTitle: '',
            department: '',
            projectPriority: '',
            clientFullName: '',
            budget: '',
            projectStartDate: '',
            projectEndDate: '',
            manager: [],
            teamMembers: [],
            description: '',
            workStatus: '',
            clientNumber: '',
            clientEmail: '',
            clientAddress: '',
          });
          setErrors({});
          e.target.reset();
          notify('Project Added Successfully');
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
          Is this a client project?
        </label>
        <input
          type="checkbox"
          className="ml-2"
          checked={isClientProject}
          onChange={() => setIsClientProject(!isClientProject)}
        />
        <span className="text-gray-700 ms-2">Yes</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-md rounded-lg">

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

        {isClientProject && (
          <>
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
          </>
        )}

        <TextInput
          name="budget"
          label="Budget"
          type="text"
          placeholder="Budget*"
          value={formData.budget}
          onChange={handleChange}
          error={errors.budget}
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


        < div className="col-span-1 md:col-span-2" >
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="manager"
          >
            Manager
          </label>
          <DropdownBoxTeam
            options={managerlist ? managerlist : []}
            onSelect={handleManagerSelect}
            error={errors.manager}
          />
          {formData.manager.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {formData.manager.map((member, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {member.name}{' '}
                  <button
                    type="button"
                    onClick={() => handleRemoveManager(member.empId)}
                  >
                    x
                  </button>
                </span>
              ))}

            </div>
          )}
        </div>



        <div className="col-span-1 md:col-span-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="teamMembers"
          >
            Team Members
          </label>
          <DropdownBoxTeam
            options={empList ? empList : []}
            onSelect={handleTeamMemberSelect}
            error={errors.teamMembers}
          />
          {formData.teamMembers.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {formData.teamMembers.map((member, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {member.name}{' '}
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(member.empId)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>


        <DropdownBox
          name="workStatus"
          label="Work Status"
          placeholder="Work Status*"
          options={['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled']}
          value={formData.workStatus}
          onChange={handleChange}
          error={errors.workStatus}
        />

        <TextInput
          name="description"
          label="Description"
          type="text"
          placeholder="Description*"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
