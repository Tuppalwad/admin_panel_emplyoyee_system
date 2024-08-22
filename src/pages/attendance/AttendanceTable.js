import React, { useEffect, useState } from 'react';
import { EmployeeAttendanceInfo } from '../../components/popup';
import { useDispatch } from 'react-redux';
import { getAttendanceToday } from '../../redux/actions/attendance';
import moment from 'moment';

const AttendanceTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const dispatch = useDispatch();

    // Filter the attendance data based on the search term
    const filteredData = attendanceData.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
    };

    const getAttendanceData = async () => {
        try {
            const response = await dispatch(getAttendanceToday());
            setAttendanceData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAttendanceData();
    }, []);


    if (attendanceData.length === 0) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Today's Attendance</h1>
                <div className="flex items-center p-1 w-1/3">
                    <p className="text-gray-600">Search:</p>
                    <input
                        type="text"
                        placeholder="Search employee"
                        className="p-2 border border-gray-300 rounded ml-2 w-full"
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First In</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Out</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map(employee => (
                            <tr key={employee._id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => handleRowClick(employee)}>
                                <td className="py-2 text-left ps-6">
                                    <img src={"https://via.placeholder.com/40"} alt="profile" className="rounded-full h-10 w-10" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {employee.fullName.length > 25 ? `${employee.fullName.slice(0, 25)}...` : employee.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {moment(employee.inTime).utc().format('hh:mm A')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {moment(employee.inTime).utc().format('hh:mm A')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {employee.shift}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {employee.totalHours}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 mr-2">
                                    <span className={`px-2 py-1 rounded-full ${employee.status === 'Present' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {employee.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4 py-3 ml-auto bg-white">
                <div className="flex items-center"></div>
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                    <select
                        id="itemsPerPage"
                        className="p-2 px-2 border border-gray-300 rounded mr-2"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                    <span>
                        {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`}
                    </span>
                    <button
                        className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <button
                        className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {selectedEmployee && (
                <EmployeeAttendanceInfo onClose={handleCloseModal} empId={selectedEmployee.empId} />
            )}
        </div>
    );
};

export default AttendanceTable;
