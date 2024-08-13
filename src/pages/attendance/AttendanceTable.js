// src/App.js
import React, { useState } from 'react';
import { EmployeeAttendanceInfo } from '../../components/popup';

const dummyData = [
    { id: 1, name: 'John Deo', firstIn: '10:30', break: '01:15', lastOut: '19:37', total: '08:02', status: 'present', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Sarah Smith', firstIn: '10:32', break: '01:00', lastOut: '19:30', total: '08:10', status: 'absent', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Edna Gilbert', firstIn: '10:42', break: '01:10', lastOut: '19:32', total: '08:08', status: 'absent', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Shelia Osterberg', firstIn: '10:38', break: '01:07', lastOut: '19:40', total: '08:00', status: 'present', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 5, name: 'BarbaraShelia Osterberg Garland', firstIn: '10:33', break: '01:15', lastOut: '19:30', total: '08:01', status: 'present', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Sarah Smith', firstIn: '10:30', break: '01:10', lastOut: '19:37', total: '08:10', status: 'absent', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 7, name: 'Marie Brodsky', firstIn: '10:32', break: '01:05', lastOut: '19:40', total: '08:00', status: 'absent', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 8, name: 'Kara Thompson', firstIn: '10:40', break: '01:07', lastOut: '19:30', total: '08:12', status: 'present', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 9, name: 'Joseph Nye', firstIn: '10:28', break: '01:00', lastOut: '19:32', total: '08:02', status: 'present', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 10, name: 'Ricardo Wendler', firstIn: '10:38', break: '01:15', lastOut: '19:37', total: '08:00', status: 'present', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 11, name: 'Maya Lee', firstIn: '10:34', break: '01:15', lastOut: '19:33', total: '08:05', status: 'absent', shift: 'Night Shift', image: 'https://via.placeholder.com/40' },
    { id: 12, name: 'Chris Johnson', firstIn: '10:32', break: '01:05', lastOut: '19:38', total: '08:00', status: 'present', shift: 'Day Shift', image: 'https://via.placeholder.com/40' },
    { id: 13, name: 'Alex Stevens', firstIn: '10:36', break: '01:07', lastOut: '19:35', total: '08:01', status: 'absent', shift: 'Night Shift', image: 'https://via.placeholder.com/40' }
];

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const filteredData = dummyData.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Today's Attendance</h1>
                <div
                    className="flex items-center  p-1 w-1/3"
                >
                    <p className="text-gray-600 ">Search:</p>
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
                    <thead className='bg-gray-50' >
                        <tr>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Name</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  ">First In</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  ">Break</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  ">Last Out</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  ">Total</th>
                            <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Status</th>
                            {/* <th className="py-2">Shift</th> */}
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {currentData.map(employee => (
                            <tr key={employee.id} className="border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(employee)}
                            >
                                <td className="py-2 text-left ps-6"><img src={employee.image} alt="profile" className="rounded-full h-10 w-10 " /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.name.length > 25 ? `${employee.name.slice(0, 25)}...` : employee.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.firstIn}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.break}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.lastOut}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 mr-2">
                                    <span className={`px-2 py-1 rounded-full ${employee.status === 'present' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {employee.status}
                                    </span>
                                </td>
                                {/* <td className="py-2">{employee.shift}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4 py-3 ml-auto bg-white">
                <div className="flex items-center">

                </div>

                <div className="flex items-center ">
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
                <EmployeeAttendanceInfo onClose={handleCloseModal} employee={selectedEmployee} />
            )}
        </div>
    );
};

export default App;
