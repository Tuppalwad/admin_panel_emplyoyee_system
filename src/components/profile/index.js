import React, { useEffect, useState } from 'react';
import { TextInput, DropdownBox, Loading, avatarUrl } from '../common';
import { updateEmployee } from '../../redux/actions/employeeActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import ProfileInfo from './ProfileInfo';
import { jwtDecode } from "jwt-decode";
import { getAdmininfo } from '../../redux/actions/adminAction';
import { uploadImage } from '../common/uploadImage';
import { capitalize } from '../../utils/utils';

const Profile = () => {
    const [admin, setAdmin] = useState({});
    const token = localStorage.getItem('token') || '';
    const decode = jwtDecode(token);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const dummyimage = avatarUrl({ email: decode?.email });
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        fullname: decode?.fullname,
        role: decode?.role,
        email: decode?.email,
        gender: '',
        mobile: '',
        linkedIn: '',
        address: '',
        education: '',
        experience: '',
        profileImage: '',
        about: '',
        country: '',
    });

    useEffect(() => {
        // Fetch admin details from backend
        const fetchAdmin = async () => {
            const res = await dispatch(getAdmininfo(decode?.email));

            console.log(res);
            if (res?.code === 200) {
                setAdmin(res?.data);
            }
        };
        fetchAdmin();
    }, [admin?.gender, decode?.email]);


    console.log(formData);

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const notify = (message) => toast(message);

    const handleChange = (e) => {
        setErrors({
            ...errors,
            [e.target.name]: '',
        });

        if (e.target.name === 'mobile' && e.target.value.length > 10) {
            return;
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.fullname) newErrors.fullName = 'Full Name is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.education) newErrors.education = 'Education is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile Number is required';
        if (!formData.about) newErrors.about = 'About is required';
        if (!image) newErrors.profileImage = 'Profile Image is required';
        if (!formData.linkedIn) newErrors.linkedIn = 'LinkedIn is required';
        // if (!formData.profileImage) newErrors.profileImage = 'Profileimage is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile Number is invalid';
        }
        if (formData.linkedIn && !/^(https?:\/\/)?([\w\d-]+\.)?linkedin\.com\/.*$/.test(formData.linkedIn)) {
            newErrors.linkedIn = 'LinkedIn is invalid';
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
                

                const check = await uploadImage(decode?.email, image);
                console.log(check);

                const res = await dispatch(updateEmployee({ ...formData, profileImage: check?.url }));
                if (res.code === 200) {
                    e.target.reset();
                    notify('Profile Updated Successfully');
                } else {
                    notify(res.message);
                }
            } catch (error) {
                console.log('Error submitting form:', error);
                notify(error.message);
            } finally {
                setLoading(false);
                setIsEditing(false);
                setErrors({});
                setFormData({
                    fullname: '',
                    role: '',
                    gender: '',
                    mobile: '',
                    linkedIn: '',
                    address: '',
                    education: '',
                    experience: '',
                    about: '',
                    country: '',
                });
                setImage(null);

            }
        }
    };



    const handleImageChange = (e) => {
        setErrors({
            ...errors,
            profileImage: '',
        });
        setImage(e.target.files[0]);
    };



    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            {loading && <Loading />}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <img
                            src={admin.profilePicture || dummyimage}
                            alt="Profile"
                            className="w-24 h-24 object-cover rounded-full mr-6"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{capitalize(decode?.fullname)}</h2>
                            <p className="text-gray-600">{decode?.email}</p>
                            <p className="text-gray-600">{decode?.role}</p>
                        </div>

                    </div>
                    {/* show messget to please complete your profile */}


                    {admin.gender && <button
                        onClick={() => setIsEditing(!isEditing)}
                        className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {isEditing ? <i className="fas fa-times text-blue-500 hover:text-blue-700"></i> : <i className="fas fa-edit text-blue-500 hover:text-blue-700"></i>}
                    </button>}
                </div>
                {!admin.gender && (
                    <button
                        className="text-red-500 text-sm mb-4 text-center cursor-pointer"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                        Please complete your profile
                    </button>
                )}

                {isEditing ? (
                    admin?.gender ? <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                            label="Full Name"
                            name="radhe"
                            type="text"
                            value={formData?.fullname}
                            onChange={handleChange}
                            error={errors.fullname}
                            placeholder={decode?.fullname}
                        />
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            value={decode?.email}
                            onChange={handleChange}
                            error={errors.email}
                            style={{ backgroundColor: '#f9f9f9' }}
                            disabled={true}
                            placeholder={decode?.email}
                        />
                        <DropdownBox
                            label="Gender"
                            name="gender"
                            options={['MALE', 'FEMALE']}
                            value={admin?.gender}
                            onChange={handleChange}
                            error={errors.gender}
                            placeholder={admin?.gender}
                        />
                        <DropdownBox
                            label="Role"
                            name="role"
                            options={["CEO", 'HR', "FOUNDER", "MANAGER", "CO-FOUNDER"]}
                            value={formData?.role}
                            onChange={handleChange}
                            error={errors.role}
                            placeholder={admin?.role}
                        />
                        <DropdownBox
                            label="Work Type"
                            name="worktype"
                            options={['WFO', 'WFH', 'Client Location']}
                            value={formData?.worktype}
                            onChange={handleChange}
                            error={errors.worktype}
                            placeholder={admin?.worktype}
                        />
                        <TextInput
                            label="Phone Number"
                            name="mobile"
                            type="number"
                            value={formData?.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                            maxlength={10}
                            placeholder={admin?.mobile}
                        />
                        <TextInput
                            label="Education"
                            name="education"
                            type="text"
                            value={formData?.education}
                            onChange={handleChange}
                            error={errors.education}
                            placeholder={admin?.education}
                        />
                        <DropdownBox
                            label="Experience"
                            name="experience"
                            options={['0-1', '1-2', '2-3', '3-4', '4-5', '5+']}
                            value={formData?.experience}
                            onChange={handleChange}
                            error={errors.experience}
                            placeholder={admin?.experience}
                        />

                        <TextInput
                            label="Address"
                            name="address"
                            type="text"
                            value={formData?.address}
                            onChange={handleChange}
                            error={errors.address}
                            placeholder={admin?.address}
                        />
                        <DropdownBox
                            label="Country"
                            name="country"
                            options={['India', 'USA', 'UK', 'Canada']}
                            value={formData?.country}
                            onChange={handleChange}
                            error={errors.country}
                            placeholder={admin?.country}
                        />

                        <TextInput
                            label="About"
                            name="about"
                            type="text"
                            value={formData?.about}
                            onChange={handleChange}
                            error={errors.about}
                            placeholder={admin?.about}
                        />

                        {/* show profile image */}
                        <div className="flex items-center">
                            <img
                                src={admin?.profilePicture || dummyimage}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full mr-6"
                            />

                            <TextInput
                                label="Profile Image"
                                name="image"
                                type="file"
                                // value={image}
                                onChange={handleImageChange}
                                error={errors.profileImage}
                            />
                        </div>

                        <TextInput
                            label="LinkedIn"
                            name="linkedIn"
                            type="text"
                            value={formData?.linkedIn}
                            onChange={handleChange}
                            error={errors.linkedIn}
                            placeholder={admin?.linkedIn}
                        />
                        <button
                            type="submit"
                            className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? 'Updating Profile...' : 'Update Profile'}
                        </button>
                    </form> :
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextInput
                                label="Full Name"
                                name="fullname"
                                type="text"
                                value={formData?.fullname}
                                onChange={handleChange}
                                error={errors.fullName}
                                placeholder={decode?.fullname}
                            />
                            <TextInput
                                label="Email"
                                name="email"
                                type="email"
                                value={decode?.email}
                                onChange={handleChange}
                                error={errors.email}
                                style={{ backgroundColor: '#f9f9f9' }}
                                disabled={true}
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
                                label="Role"
                                name="role"
                                options={["CEO", 'HR', "FOUNDER", "MANAGER", "CO-FOUNDER"]}
                                value={formData.role}
                                onChange={handleChange}
                                error={errors.role}
                                placeholder={decode?.role}
                            />


                            <DropdownBox
                                label="Work Type"
                                name="worktype"
                                options={['WFO', 'WFH', 'Client Location']}
                                value={formData.worktype}
                                onChange={handleChange}
                                error={errors.worktype}
                            />
                            <TextInput
                                label="Phone Number"
                                name="mobile"
                                type="number"
                                value={formData.mobile}
                                onChange={handleChange}
                                error={errors.mobile}
                                maxlength={10}
                            />
                            <TextInput
                                label="Education"
                                name="education"
                                type="text"
                                value={formData.education}
                                onChange={handleChange}
                                error={errors.education}
                            />
                            <DropdownBox
                                label="Experience"
                                name="experience"
                                options={['0-1', '1-2', '2-3', '3-4', '4-5', '5+']}
                                value={formData.experience}
                                onChange={handleChange}
                                error={errors.experience}
                            />

                            <TextInput
                                label="Address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                error={errors.address}
                            />
                            <DropdownBox
                                label="Country"
                                name="country"
                                options={['India', 'USA', 'UK', 'Canada']}
                                value={formData.country}
                                onChange={handleChange}
                                error={errors.country}
                            />

                            <TextInput
                                label="About"
                                name="about"
                                type="text"
                                value={formData.about}
                                onChange={handleChange}
                                error={errors.about}
                            />
                            <TextInput
                                label="Profile Image"
                                name="image"
                                type="file"
                                // value={image}
                                onChange={handleImageChange}
                                error={errors.profileImage}
                            />
                            <TextInput
                                label="LinkedIn"
                                name="linkedIn"
                                type="text"
                                value={formData.linkedIn}
                                onChange={handleChange}
                                error={errors.linkedIn}
                            />
                            <button
                                type="submit"
                                className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? 'Updating Profile...' : 'Update Profile'}
                            </button>
                        </form>

                ) : (
                    admin?.gender ? <ProfileInfo admin={admin} /> : <div className="text-center py-8 bg-gray-100">Admin details not found
                        Please click on edit button to update your profile
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
