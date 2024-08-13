// src/LeaveManagement.js
import React, { useState } from 'react';
import LeaveReq from '../../components/popup/LeaveReq';

const dummyData = [
  { id: 1, name: 'John Deo', leaveType: 'Sick', leaveFrom: '2023-07-01', leaveTo: '2023-07-05', noOfDays: 5, reason: 'Flu', status: 'Approved', action: 'View' },
  { id: 2, name: 'Sarah Smith', leaveType: 'Vacation', leaveFrom: '2023-07-10', leaveTo: '2023-07-15', noOfDays: 6, reason: 'Family Trip', status: 'Pending', action: 'View' },
  { id: 3, name: 'Edna Gilbert', leaveType: 'Sick', leaveFrom: '2023-07-20', leaveTo: '2023-07-22', noOfDays: 3, reason: 'Fever', status: 'Rejected', action: 'View' },
  { id: 4, name: 'Shelia Osterberg', leaveType: 'Maternity', leaveFrom: '2023-08-01', leaveTo: '2023-08-31', noOfDays: 31, reason: 'Childbirth', status: 'Approved', action: 'View' },
];

const AllLeaveRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

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

  const filteredData = dummyData.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.id.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const handleViewClick = (leave) => {
    setSelectedLeave(leave);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedLeave(null);
  };

  const handleStatusChange = (status) => {
    if (selectedLeave) {
      // Update the status of the selected leave request
      const updatedLeave = { ...selectedLeave, status };
      // Update the dummyData or state (in a real app, this should be done via API call)
      console.log(`Updating leave ${selectedLeave.id} to ${status}`);
      setSelectedLeave(updatedLeave);
    }
    handleClosePopup();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Management</h1>
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
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leaveType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leaveFrom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leaveTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.noOfDays}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reason}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500
                  ${row.status === 'Approved' ? 'text-green-600 ' : row.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}
                  `}>{row.status}</td>
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
