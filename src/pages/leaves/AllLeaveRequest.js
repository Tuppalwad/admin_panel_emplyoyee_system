// src/LeaveManagement.js
import React, { useEffect, useState } from 'react';
import LeaveReq from '../../components/popup/LeaveReq';
import { useDispatch, useSelector } from 'react-redux';
import { getallEmpLeaves, setStatusofLeave } from '../../redux/actions/leaveAction';

const AllLeaveRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const dispatch = useDispatch();
  const   { leaves ,refresh} = useSelector(state => state.leaves);
  
  useEffect(() => {
    dispatch(getallEmpLeaves());
  }, [dispatch,refresh]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page on items per page change
  };

  const handleViewClick = (leave) => {
    setSelectedLeave(leave);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedLeave(null);
  };

  const handleStatusChange = async (status) => {
    if (selectedLeave) {
      const updatedLeave = { leaveId: selectedLeave._id, empId: selectedLeave.empId, status };
      await dispatch(setStatusofLeave(updatedLeave));
    }
    handleClosePopup();
  };

  // Filter and paginate leaves data
  const filteredData = leaves.filter(leave =>
    leave.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || leave.empId.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Management</h1>
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave From</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave To</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Days</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.ceil((new Date(row.endDate) - new Date(row.startDate)) / (1000 * 60 * 60 * 24)) + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{
                  row.reason.length > 20 ? row.reason.substring(0, 20) + '...' : row.reason
                }</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 
                  ${row.status === 'Approved' ? 'text-green-600' : row.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}
                `}>
                  {row.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewClick(row)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center bg-white p-3">
        <div>
          {/* Additional elements if needed */}
        </div>
        <div>
          <span className="text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="ml-2 p-1 border border-gray-300 rounded mr-2"
          >
            {[5, 10, 15].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-gray-700">
            {startIdx + 1} - {Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="ml-2 p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2 p-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Popup */}
      {popupVisible && selectedLeave && (
        <LeaveReq selectedLeave={selectedLeave} handleClosePopup={handleClosePopup} handleStatusChange={handleStatusChange} />
      )}
    </div>
  );
};

export default AllLeaveRequest;
