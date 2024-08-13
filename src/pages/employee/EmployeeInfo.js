import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees, deleteEmployee, updateEmployee } from '../../redux/actions/employeeActions';
import { EditEmployeePopup } from '../../components/popup';
import EmployeeInfoPopup from '../../components/popup/EmployeeInfoPopup';

const dummyEmployees = [
    {
        empId: "E001",
        FirstName: "John",
        MiddleName: "A.",
        LastName: "Doe",
        Email: "john.doe@example.com",
        Gender: "Male",
        DOB: "1990-01-01",
        DateOfJoining: "2020-01-01",
        YearOfPassing: "2012",
        ContactNo: "1234567890",
        education: "B.Tech",
        workExperience: 2,
        BloodGroup: "O+",
        EmergencyContactNo: "0987654321",
        PANcardNo: "ABCDE1234F",
        AdharcardNo: "123456789012",
        PermanetAddress: "123, Main St",
        PresentAddress: "456, Elm St",
        status: "Approve",
        PhysicallyDisabled: false,
        maritalStatus: "Single"
    },
    {
        empId: "E002",
        FirstName: "Jane",
        MiddleName: "B.",
        LastName: "Smith",
        Email: "jane.smith@example.com",
        Gender: "Female",
        DOB: "1992-05-05",
        DateOfJoining: "2019-06-01",
        YearOfPassing: "2014",
        ContactNo: "0987654321",
        education: "M.Tech",
        workExperience: 5,
        BloodGroup: "A+",
        EmergencyContactNo: "1234567890",
        PANcardNo: "BCDEF2345G",
        AdharcardNo: "098765432109",
        PermanetAddress: "789, Oak St",
        PresentAddress: "101, Pine St",
        status: "Approve",
        PhysicallyDisabled: false,
        maritalStatus: "Married"

    },
    // Add 3 more dummy employee objects here
];

function EmployeeInfo() {
    const dispatch = useDispatch();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');

    const employee = useSelector((state) => state.employee);
    //   const { allEmployees = dummyEmployees } = employee;
    const allEmployees = dummyEmployees;
    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const itemsPerPageOptions = [5, 10, 15];

    const filteredData = allEmployees && allEmployees.filter(employee =>
        employee.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.MiddleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empId.toString().includes(searchTerm)
    );

    const totalPages = filteredData && Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData && filteredData.slice(startIdx, startIdx + itemsPerPage);

    const handleDelete = (empId) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            dispatch(deleteEmployee(empId));
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setIsEditPopupOpen(true);
    };

    return (
        <div className="container p-4">

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Employee All Info</h1>
                <div className="flex items-center p-1 w-1/3">
                    <p className="text-gray-600">Search:</p>
                    <input
                        type="text"
                        placeholder="Search employee"
                        className="p-2 border border-gray-300 rounded ml-2 w-full"
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Join</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Passing</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Experience</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact No</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PANcard No</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adharcard No</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PermanetAddress</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PresentAddress</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physically Disabled</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData && paginatedData.length > 0 ? (
                            paginatedData.map((employee) => (
                                <tr key={employee.empId} className="border-b">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.empId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${employee.FirstName} ${employee.MiddleName} ${employee.LastName}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.Email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.Gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(employee.DOB).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(employee.DateOfJoining).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.YearOfPassing}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.ContactNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.education}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.workExperience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.BloodGroup}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.EmergencyContactNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.PANcardNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.AdharcardNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.PermanetAddress}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.PresentAddress}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.PhysicallyDisabled ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.maritalStatus}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700
                                        ${employee.status === 'Approve' ? 'text-green-700' : 'text-red-700'}
                                        `}>{employee.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 cursor-pointer" onClick={() => handleEdit(employee)}>view</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 bg-white p-4">
                <div></div>
                <div>
                    <span className="text-gray-700">Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="ml-2 p-1 border border-gray-300 rounded outline-none mr-2"
                    >
                        {itemsPerPageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="text-gray-700">{startIdx + 1} - {Math.min(startIdx + itemsPerPage, allEmployees.length)} of {allEmployees.length}</span>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="ml-2 p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-2 p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            {isEditPopupOpen && <EmployeeInfoPopup
                employee={selectedEmployee}
                onClose={() => setIsEditPopupOpen(false)}
                reject={() => dispatch(updateEmployee({ ...selectedEmployee, status: 'Reject' }))}
                approve={() => dispatch(updateEmployee({ ...selectedEmployee, status: 'Approve' }))}
            />}
        </div>
    );
}

export default EmployeeInfo;
