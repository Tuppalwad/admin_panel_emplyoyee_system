import React, { useEffect, useState } from 'react';
import { DropdownBox, TextInput, Loading } from '../../components/common';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { getAllEmployees, } from '../../redux/actions/employeeActions';
import { validatedata } from './validate';
import { createProject, editProjectData, getManagerList } from '../../redux/actions/projectAction';
import DropdownBoxTeam from './DropdownBoxTeam';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const location = useLocation();
  const projectData = location.state?.info || {}
  const [isClientProject, setIsClientProject] = useState(projectData?.isClientProject ?? false);
  const navigate = useNavigate();

  console.log(projectData, 'kkkk')

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty if no date is provided
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };


  const [formData, setFormData] = useState({
    projectTitle: projectData?.projectTitle ? projectData?.projectTitle : '',
    department: projectData?.department ? projectData?.department : '',
    projectPriority: projectData?.projectPriority ? projectData?.projectPriority : '',
    budget: projectData?.budget ? projectData?.budget : '',
    projectStartDate: projectData?.projectStartDate ? formatDate(projectData?.projectStartDate) : '',
    projectEndDate: projectData?.projectEndDate ? formatDate(projectData?.projectEndDate) : '',
    manager: projectData?.manager ? projectData?.manager : [],
    teamMembers: projectData?.teamMembers ? projectData?.teamMembers : [],
    description: projectData?.description ? projectData?.description : '',
    workStatus: projectData?.workStatus ? projectData?.workStatus : '',
    clientNumber: projectData?.clientContact?.clientFullName ? projectData?.clientContact?.clientFullName : '',
    clientEmail: projectData?.clientContact?.email ? projectData?.clientContact?.email : '',
    clientAddress: projectData?.clientContact?.address ? projectData?.clientContact?.address : '',
    clientFullName: projectData?.clientContact?.phone ? projectData?.clientContact?.phone : '',
  });


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

  const empList = allEmployees
    .filter((item) => item.role !== "MANAGER" && item.role !== "HR") // Filter out non-manager and non-HR roles
    .map((item) => ({
      name: item.fullName,
      empId: item.empId,
      role: item.role,
    }));

  const managerlist = allEmployees
    .filter((item) => item.role === "MANAGER") // Filter only manager roles
    .map((item) => ({
      name: item.fullName,
      empId: item.empId,
      role: item.role,
    }));

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
      console.log('error', newErrors);
      setErrors(newErrors);
    } else {
      try {
        const data = {
          projectId: projectData?._id,
          projectTitle: formData?.projectTitle ? formData?.projectTitle : '',
          department: formData?.department ? formData?.department : '',
          projectPriority: formData?.projectPriority ? formData?.projectPriority : '',
          budget: formData?.budget ? formData?.budget : '',
          projectStartDate: formData?.projectStartDate ? formatDate(formData?.projectStartDate) : '',
          projectEndDate: formData?.projectEndDate ? formatDate(formData?.projectEndDate) : '',
          manager: formData?.manager ? formData?.manager : [],
          teamMembers: formData?.teamMembers ? formData?.teamMembers : [],
          description: formData?.description ? formData?.description : '',
          workStatus: formData?.workStatus ? formData?.workStatus : '',
          clientContact: {
            clientNumber: formData?.clientNumber ? formData?.clientNumber : '',
            clientEmail: formData?.clientEmail ? formData?.clientEmail : '',
            clientAddress: formData?.clientAddress ? formData?.clientAddress : '',
            clientFullName: formData?.clientFullName ? formData?.clientFullName : '',
          },
          isClientProject: isClientProject ? true : false,
        };

        setLoading(true);
        let res;

        if (projectData) {
          res = await dispatch(editProjectData(data));
        } else {
          res = await dispatch(createProject(data));
        }

        if (res.code === 200) {
          setErrors({});
          if (projectData) {
            notify('Project Updated Successfully');
            navigate(-1); // Navigate back to the previous page
          } else {
            notify('Project Added Successfully');
            // navigate('/projects'); // Replace '/projects' with your desired route
          }
        } else {
          notify(res.message);
        }
      } catch (error) {
        notify('Error adding project');
        console.log(error, "ddd")
      } finally {
        setLoading(false);
        setIsClientProject(!isClientProject);
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
      }
    }
  };

  // Initialize navigate at the beginning of your component




  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      {loading && <Loading />}
      <h1 className="text-xl font-bold mb-4 mt-1 text-gray-800">Add Project</h1>
      <div className="mb-3 flex items-center">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 shadow-sm rounded-lg">

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
          onClick={handleSubmit}
          disabled={loading}
          className="col-span-1 md:col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {loading ? "loading.." : projectData ? "Update Project" : "Add Project"}
        </button>
      </div>
    </div>
  );
};

export default AddProject;
