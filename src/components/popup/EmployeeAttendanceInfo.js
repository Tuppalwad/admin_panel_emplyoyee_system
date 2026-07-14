// src/EmployeeModal.js
import React, { useEffect, useState } from 'react';
import { getemployeeattendanceInfo } from '../../redux/actions/attendance';
import { useDispatch } from 'react-redux';

const EmployeeAttendanceInfo = ({ empId, onClose }) => {

    const [employee, setEmployee] = useState();
    const dispatch = useDispatch();
    const fetchinfo = async () => {
        const res = await dispatch(getemployeeattendanceInfo({ empId }));
        console.log(res);
        if (res.code === 200) {
            setEmployee(res.data);
        }
    }

    useEffect(() => {
        fetchinfo();
    }, []);


    console.log(employee);

    return employee ? <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Employee Attendance Info</h2>
                <button onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="flex items-center mb-4">
                <img src={"https://via.placeholder.com/40"} alt="profile" className="rounded-full h-16 w-16 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">{employee.fullName}</h2>
                    <p className="text-gray-600">{employee.shift}</p>
                </div>
            </div>

            <div className="space-y-2">
                <p><strong>Total Leave:</strong> {employee.totalLeave}</p>
                <p><strong>Present:</strong> {employee.present}</p>
                <p><strong>Absent:</strong> {employee.absent}</p>
                <p><strong>Medical Leave:</strong> {employee.medicalLeave}</p>
                <p><strong>Average Working Time:</strong> {employee.avgWorkingTime}</p>
                <p><strong>Average In Time:</strong> {employee.avgInTime}</p>
                <p><strong>Average Out Time:</strong> {employee.avgOutTime}</p>
            </div>
        </div>
    </div> : <div>
        Loading...
    </div>;
};

export default EmployeeAttendanceInfo;
