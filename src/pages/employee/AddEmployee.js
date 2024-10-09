import React, { useState } from 'react';
import { TextInput, DropdownBox, Loading } from '../../components/common';
import { setEmployee } from '../../redux/actions/employeeActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    role: '',
    worktype: '',
    mobile: '',
    shift: ''
  });
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

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.worktype) newErrors.worktype = 'Work Type is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
    if (!formData.shift) newErrors.shift = 'Shift is required';
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setLoading(true);
        // Submit form data to backend
        const res = await dispatch(setEmployee(formData));
        if (res.code === 200) {
          notify('Employee Added Successfully');
          e.target.reset();
        } else {
          notify(res.message);
        }
      } catch (error) {
        console.log('Error submitting form:', error);
        notify(error.message);
      } finally {
        setLoading(false);
        setFormData({
          fullName: '',
          email: '',
          gender: '',
          role: '',
          worktype: '',
          mobile: '',
          shift: ''

        });
        setErrors({
          fullName: '',
          email: '',
          gender: '',
          role: '',
          worktype: '',
          mobile: '',
          shift: ''

        });

      }

    }
  };


  return (
    <div className=" container  mx-10  p-5 ">
      <ToastContainer />
      {loading && <Loading />}
      <h1 className="text-2xl font-bold mb-6 mt-3 text-gray-800">Add Employee</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 shadow-md rounded-lg">
        <TextInput
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder={"Enter employee Full Name"}
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={"Enter employee email"}
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
          label={"Role"}
          name='role'
          options={["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"]}
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
        />

        <DropdownBox
          label="Work Type"
          name="worktype"
          options={['WFO', 'WFH', 'Client Location']}
          value={formData.worktype}
          onChange={handleChange}
          error={errors.worktype}
        />
        <DropdownBox
          label="Shift"
          name="shift"
          options={['Day Shift', 'Evening Shift', 'Night Shift']}
          value={formData.shift}
          onChange={handleChange}
          error={errors.shift}
        />

        <TextInput
          label="Phone Number"
          name="mobile"
          type="number"
          value={formData.mobile}
          onChange={handleChange}
          error={errors.mobile}
          maxLength={10}
          placeholder={"Enter employee phone number"}
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Adding Employee...' : 'Add Employee '}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
