import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees, deleteEmployee, updateEmployee, getAllEmployeeinfo, updateEmpStatus, searchDataOnFilter } from '../../redux/actions/employeeActions';
import { EditEmployeePopup } from '../../components/popup';
import EmployeeInfoPopup from '../../components/popup/EmployeeInfoPopup';
import { Loading } from '../../components/common';
import { experienceRange, skills } from '../../utils/utils';
import Select from "react-select";
import { debounce } from 'lodash';

function EmployeeInfo() {
    const dispatch = useDispatch();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredData, setFilterData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const isSidebarOpen = useSelector((state) => !state.sidebar.isSidebarOpen);

    const fetchdataonSearch = useCallback(async () => {
        try {
            const getSkill = selectedSkill?.map(item => item.value) || []; // Avoid error if selectedSkill is null
            const data = { name: searchTerm, skill: getSkill, experience: selectedExperience?.value };

            const res = await dispatch(searchDataOnFilter(data));

            if (res.code === 200 && res.data) {
                setFilterData(res.data);
            } else {
                setFilterData([]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [searchTerm, selectedSkill, selectedExperience, dispatch]);

    useEffect(() => {
        const debouncedSearch = debounce(fetchdataonSearch, 500);
        debouncedSearch();
        return () => debouncedSearch.cancel();
    }, [fetchdataonSearch]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const itemsPerPageOptions = [5, 10, 15];


    const totalPages = filteredData && Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData && filteredData.slice(startIdx, startIdx + itemsPerPage);




    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setIsEditPopupOpen(true);
    };


    // if (!allEmployee) {
    //     return <div>
    //         <Loading />
    //     </div>;
    // }


    const handleReject = async (empId) => {
        if (window.confirm("Are you sure you want to reject this employee?")) {
            const res = await dispatch(updateEmpStatus({ empId, status: 'Reject' }));
            if (res.code === 200) {
                setIsEditPopupOpen(false);
                fetchdataonSearch();


            }
        }
    }

    const handleApprove = async (empId) => {
        if (window.confirm("Are you sure you want to approve this employee?")) {
            const res = await dispatch(updateEmpStatus({ empId, status: 'Approve' }));
            if (res.code === 200) {
                setIsEditPopupOpen(false);
                fetchdataonSearch();

            }
        }
    }
    const customStyles = {
        control: (base) => ({
            ...base,
            borderColor: "#ccc", // Default border color
            boxShadow: "none", // Removes focus border shadow
            "&:hover": {
                borderColor: "#aaa", // Slightly darker border on hover
            },
            border: "none",
            outline: "none",
        }),
        input: (base) => ({
            ...base,
            border: "none", // Removes border from the input field
            boxShadow: "none", // Removes focus effect
            outline: "none",

        })
    };

    const clearSearch = () => {
        setSearchTerm(""); // Clears the input field
    };

    return (
        <div className={`container${!isSidebarOpen ? "-full" : ""} p-4`}>


            <div className="mb-4 flex flex-wrap items-center justify-between w-full gap-x-4">
                {/* Heading */}
                <h1 className="text-2xl font-bold whitespace-nowrap">Employee All Info</h1>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center w-full sm:w-auto gap-x-4 mt-4 ">
                    {/* Search Input */}
                    <div className="flex items-center space-x-2">
                        <p className="text-gray-600 whitespace-nowrap">Search:</p>
                        <div className="relative w-72">
                            <input
                                type="text"
                                placeholder="Search employee by name and project"
                                className="p-2 border border-gray-300 rounded w-full pr-8"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 pr-2"
                                    onClick={clearSearch}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Searchable Skills Dropdown */}
                    <div className="w-64">
                        <Select
                            options={skills}
                            value={selectedSkill}
                            onChange={setSelectedSkill} // Handles multiple values
                            isMulti // Enables multiple selection
                            isSearchable
                            isClearable // Enables the "X" button to remove selections
                            styles={customStyles}
                            placeholder="Select Skills"
                            className="border border-gray-300 rounded"
                        />
                    </div>

                    {/* Experience Dropdown */}
                    <div className="w-48">
                        <Select
                            options={experienceRange}
                            value={selectedExperience}
                            onChange={setSelectedExperience}
                            isClearable // Enables the "X" button to remove selection
                            placeholder="Select Experience"
                            styles={customStyles}
                            className="border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>


            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Work Experience</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Passing</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData && paginatedData?.length > 0 ? (
                            paginatedData?.map((employee) => (
                                <tr key={employee.empId} className="border-b">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.empId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${employee.FirstName} ${employee.MiddleName} ${employee.LastName}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.skillAndExperience[0]?.skill}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.skillAndExperience[0]?.experience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.workExperience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.currentlyWrokingProject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.ContactNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee?.education}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(employee.YearOfPassing).toLocaleDateString().split("/")[2]}</td>
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
                    <span className="text-gray-700">{startIdx + 1} - {Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length}</span>
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
                reject={() => handleReject(selectedEmployee.empId)}
                approve={() => handleApprove(selectedEmployee.empId)}
            />}
        </div>
    );
}

export default EmployeeInfo;



