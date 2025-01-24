import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees, deleteEmployee, updateEmployee } from '../../redux/actions/employeeActions';
import { EditEmployeePopup } from '../../components/popup';

function ViewEmployee() {
  const dispatch = useDispatch();

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');

  const employee = useSelector((state) => state.employee);
  const { allEmployees } = employee;

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

  const filteredData = allEmployees&& allEmployees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || employee.empId.toString().includes(searchTerm)
  );


  const totalPages = filteredData&& Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData&& filteredData?.slice(startIdx, startIdx + itemsPerPage);


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
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div
          className="flex items-center  p-1 w-1/3"
        >
          <p className="text-gray-600 ">Search:</p>
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
          <thead className='bg-gray-50'>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((employee) => (
                <tr key={employee.empId} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.empId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.worktype}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(employee)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 ms-3"
                      onClick={() => handleDelete(employee.empId)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
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
        <div>

        </div>
        <div>
          <span className="text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="ml-2 p-1 border border-gray-300 rounded outline-none mr-2 "
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

      {isEditPopupOpen && <EditEmployeePopup
        employee={selectedEmployee}
        onClose={() => setIsEditPopupOpen(false)}
        onSave={(formData) => {
          setIsEditPopupOpen(false);
          dispatch(updateEmployee(formData));
        }
        }
      />}
    </div>
  );
}

export default ViewEmployee;
