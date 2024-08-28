import React, {useState} from 'react'
import { DropdownBox, TextInput } from '../../components/common'
import { useDispatch } from 'react-redux';
import DropdownWithRadioButtons from '../../components/common/DropDownWithRadioButtons';
import { ToastContainer, toast } from 'react-toastify';
import {Loading} from '../../components/common'
import CheckboxGroup from '../../components/common/CheckBoxGroup';
import handleCheckboxChange from '../../components/common/CheckBoxGroup'
import { setEmployee } from '../../redux/actions/employeeActions';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';


const AddProject = () => {

  const [formData, setFormData] = useState({
    projectId : '',
    projectTitle : '',
    department : '', 
    projectPriority : '',
    client : '',
    price : '',
    projectStartDate : '',
    projectEndDate : '',
    team : '',
    description : '',
    workStatuses : []
  })


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const notify = (message) => toast(message);

  const handleChange = (e) => {
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newSelectedValues = checked
      ? [...formData.workStatuses, value]
      : formData.workStatuses.filter(item => item !== value);
  
    // Directly update the workStatuses field
    setFormData(prevFormData => ({
      ...prevFormData,
      workStatuses: newSelectedValues,  // Explicitly reference the workStatuses property
    }));
  
    // Clear any existing error for workStatuses
    setErrors(prevErrors => ({
      ...prevErrors,
      workStatuses: '',
    }));
  };
  
  
    
  const validate = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = 'Project ID is required';
    if (!formData.projectTitle) newErrors.projectTitle = 'Project Title is required';
    if (!formData.department) newErrors.department = 'Deapartment is required';
    if (!formData.projectPriority) newErrors.projectPriority = 'project Priority is required';
    if (!formData.client) newErrors.client = 'client Name is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
    if (!formData.price) {
      newErrors.price = 'Price is required';
      } else if(!/^\d+$/.test(formData.price)){
        newErrors.price = 'Price must be valid integer';
      }
    
    if (formData.projectStartDate && formData.projectEndDate && formData.projectEndDate === formData.projectStartDate){
      newErrors.projectStartDate = "Start Date cannot be the same as End Date" 
    } else if (new Date(formData.projectEndDate) <= new Date(formData.projectStartDate)) {
      newErrors.projectEndDate = "End Date must be greater than Start Date";
    }

    if (!formData.team) newErrors.team = "selection of team is required"
    if (!formData.workStatuses.length === 0){
      newErrors.workStatuses = 'At least one work status must be selected';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    console.log('Form Data:', formData);
    console.log('Validation Errors:', newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        console.log('Submitting Form Data:', formData);
        
        // Submit form data to backend
        const res = await dispatch(setEmployee(formData));
        console.log('API Response:', res);
        
        if (res.code === 200) {
          e.target.reset();
          notify('Employee Added Successfully');
        } else {
          notify(res.message);
        }
      } catch (error) {
        console.log('Error submitting form:', error);
        notify(error.message);
      } finally {
        setLoading(false);
        setFormData({
          projectId : '',
          projectTitle : '',
          department : '', 
          projectPriority : '',
          client : '',
          price : '',
          projectStartDate : '',
          projectEndDate : '',
          team : '',
          description : '',
          workStatuses : []
        });
        setErrors({
          projectId : '',
          projectTitle : '',
          department : '', 
          projectPriority : '',
          client : '',
          price : '',
          projectStartDate : '',
          projectEndDate : '',
          team : '',
          description : '',
          workStatuses : []
        });
      }
    }
  };
  

  return (
    <div className=" container  mx-10  p-5 ">
      <ToastContainer />
      {loading && <Loading  />}
      <h1 className="text-2xl font-bold mb-6 mt-3 text-gray-800">Add Projects</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 shadow-md rounded-lg">

        <TextInput
          name="projectId" 
          label = "Project ID"
          type="text"
          placeholder="Project ID*"
          value={formData.projectId}
          onChange={handleChange}
          error={errors.projectId}
        />

        <TextInput
          name="projectTitle"  
          type="text"
          label="Project Title"
          placeholder="Project Title*"
          value={formData.projectTitle}
          onChange={handleChange}
          error={errors.projectTitle}
        />

        <DropdownBox
        name = "department" 
        label = {"Department"}              
        placeholder={"Department*"} 
        options = {['Designing', 'Development', 'Testing', 'Marketing', 'Accounts']}
        value = {formData.department}       
        onChange={handleChange}
        error = {errors.department}
        />        

        <DropdownBox       
        name = "projectPriority"      
        placeholder= "Project Priority*"
        label={"Project Priority"}
        options = {['Low','Medium','High']}
        value={formData.projectPriority}       
        onChange={handleChange}
        error={errors.projectPriority}
        />
  
        <TextInput
        name = "client"
        label = {"Client"}
        placeholder = "Client*"
        type = "text"
        value = {formData.client}
        onChange={handleChange}
        error = {errors.client}
        />

        <TextInput
        name = "price"
        type = "text"
        label = {"Price"}
        placeholder="Price*"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        />

        <TextInput
        name = "projectStartDate"
        type = "date"
        label = "Project Start Date"
        placeholder = "Project Start Date"
        value = {formData.projectStartDate}
        onChange={handleChange}
        error={errors.projectStartDate}
        />

        <TextInput
        name = "projectEndDate"
        type = "date"
        label = "Project End Date"
        placeholder = "Project End Date"
        value = {formData.projectEndDate}
        onChange={handleChange}
        error={errors.projectEndDate}
        />

        <DropdownWithRadioButtons       
        name = "team"      
        placeholder= "Team*"
        options = {['Vyankis Team','Rajeshs Team','Oms Team', 'Govinds Team']}
        value={formData.team}       
        onChange={handleChange}
        error={errors.team}
        />

        <CheckboxGroup
          className="flex flex-wrap"
          name="workStatuses"
          options={['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Deferred']}
          selectedValues={formData.workStatuses}
          onChange={handleCheckboxChange}
          error={errors.workStatuses}
          label="Work Status"
        />


        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Adding Project...' : 'Add Project '}
        </button>
        
      </form>
    </div>
  );
};

export default AddProject