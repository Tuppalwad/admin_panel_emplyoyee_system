import React, { useState } from 'react';
import { TextInput, DropdownBox, Loading } from '../../components/common';
import { setEmployee } from '../../redux/actions/employeeActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    role: '',
    worktype: '',
    mobile: '',
    shift: '',
    status: 'active',
    dateofjoining: new Date().toISOString().split('T')[0], // Default to today's date
    employeeType: 'Permanent', // Default to full-time
    currentEmpId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const notify = (message) => toast(message);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "", // Clear any previous error for the field
    });
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.currentEmpId) newErrors.currentEmpId = 'Current Employee ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.worktype) newErrors.worktype = 'Work Type is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
    // if (!formData.shift) newErrors.shift = 'Shift is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile Number is invalid';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    let res;
    // console.log(formData,'kkkk')
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        // Submit form data to backend
        res = await dispatch(setEmployee(formData));
        if (res.code === 201) {
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
        console.log(res,'kkkk')
        if (res.code === 201) {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            role: '',
            worktype: '',
            mobile: '',
            shift: '',
            status: '',
            dateofjoining: '',
            employeeType: '',
            currentEmpId: ''
          });
          setErrors({
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            role: '',
            worktype: '',
            mobile: '',
            shift: '',
            status: '',
            dateofjoining: '',
            employeeType: '',
            currentEmpId: ''
          });
        }

      }

    }
  };


  return ( 

  <div className="min-h-screen bg-slate-50 p-6">
    <ToastContainer />

{loading && <Loading />}

{/* Header */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between">

    <div>
      <h1 className="text-3xl font-bold text-slate-800">
        Add Employee
      </h1>

      <p className="text-slate-500 mt-2">
        Create a new employee profile and assign role details.
      </p>
    </div>

    <div className="hidden md:flex items-center gap-3 mt-4 md:mt-0">

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-600">
          Employee Management
        </p>

        <h3 className="font-bold text-blue-700">
          HR Module
        </h3>
      </div>

    </div>

  </div>

</div>

{/* Form */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

  {/* Section Header */}
  <div className="border-b border-slate-200 px-6 py-5">

    <h2 className="text-lg font-semibold text-slate-800">
      Employee Information
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Fill in the employee details below.
    </p>

  </div>

  <form
    onSubmit={handleSubmit}
    className="p-6"
  >

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <TextInput
        label="First Name"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        placeholder="Enter first name"
      />

      <TextInput
        label="Last Name"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        placeholder="Enter last name"
      />

      <TextInput
        label="Current Employee ID"
        name="currentEmpId"
        type="text"
        value={formData.currentEmpId}
        onChange={handleChange}
        error={errors.currentEmpId}
        placeholder="Enter current employee ID"
      />

      <TextInput
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter email address"
      />

      <TextInput
        label="Phone Number"
        name="mobile"
        type="number"
        value={formData.mobile}
        onChange={handleChange}
        error={errors.mobile}
        placeholder="Enter phone number"
      />

      <DropdownBox
        label="Gender"
        name="gender"
        options={['MALE', 'FEMALE']}
        value={formData.gender}
        onChange={handleChange}
        error={errors.gender}
      />

      <DropdownBox
        label="Designation"
        name="role"
        options={[
          'CEO',
          'CO-FOUNDER',
          'FOUNDER',
          'HR',
          'MANAGER',
          'DEVELOPER'
        ]}
        value={formData.role}
        onChange={handleChange}
        error={errors.role}
      />

      <DropdownBox
        label="Work Mode"
        name="worktype"
        options={[
          'WFO',
          'WFH',
          'Client Location'
        ]}
        value={formData.worktype}
        onChange={handleChange}
        error={errors.worktype}
      />

      <DropdownBox
        label="Status"
        name="status"
        options={[
          'Active',
          'Inactive'
        ]}
        value={formData.status}
        onChange={handleChange}
        error={errors.status}
      />
      <TextInput
        label="Date of Joining"
        name="dateofjoining"
        type="date"
        value={formData.dateofjoining}
        onChange={handleChange}
        error={errors.dateofjoining}
        placeholder="Select date of joining"
      />
      <DropdownBox
        label="Employee Type"
        name="employeeType"
        options={[
          'Permanent',
          'Contract',
          'Intern'
        ]}
        value={formData.employeeType}
        onChange={handleChange}
        error={errors.employeeType}
      />

    </div>

    {/* Footer */}
    <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row gap-3 justify-end">

      <button
        type="button"
        onClick={() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            role: '',
            worktype: '',
            mobile: '',
            shift: '',
            status: '',
            currentEmpId: '',
          });

          setErrors({});
        }}
        className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition"
      >
        Reset
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-60"
      >
        {loading
          ? 'Adding Employee...'
          : 'Add Employee'}
      </button>

    </div>

  </form>

</div>

  </div>

  );
};

export default AddEmployee;
