// src/Attendance.js
import React, { useState } from 'react';

const dummyData = [
  { id: 1, name: 'John Deo', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 2, name: 'Sarah Smith', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 3, name: 'Edna Gilbert', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 4, name: 'Shelia Osterberg', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 5, name: 'John Deo', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 6, name: 'Sarah Smith', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },
  { id: 7, name: 'Edna Gilbert', attendance: Array(30).fill(null).map(() => Math.random() > 0.2 ? 'P' : 'A') },

];

const itemsPerPageOptions = [5, 10, 15];

const MonthtyAtteData = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = dummyData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="container p-4">

      <div className="mb-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">Monthly Attendance</h1>

        {/* search bar for search by name or ID */}
        <div className="flex items-center p-1 w-1/3  ">
          <p className="text-gray-600 w-2/7"> Search :</p>
          <input
            type="text"
            placeholder="Search employee"
            className="p-2 border border-gray-300 rounded ml-2 w-2/3"
          />
        </div>


        <div className="flex items-center p-1 w-1/3  ">
          <p className="text-gray-600 w-1/4 "> Select Date</p>
          <input
            type="date"
            value={startDate}
            className="p-2 border border-gray-300 rounded ml-2 w-2/3"
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className='bg-gray-50' >
            <tr className='py-2'>
              <th className="border-r border-gray-200  px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Days</th>
              {Array.from({ length: 30 }, (_, i) => (
                <th key={i + 1} className="border-r border-gray-200  px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className='border border-gray-200'>
            {paginatedData.map((employee) => (
              <tr key={employee.id} className="cursor-pointer hover:bg-gray-100 border-b">
                <td className="border-r border-gray-200 px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.name}</td>
                {employee.attendance.map((status, i) => (
                  <td key={i} className="py-2 px-4 border-r border-gray-200">{
                    status === 'P' ?
                      <i
                        className="fas fa-check text-green-500 border border-gray-300 rounded-full"
                        style={{
                          width: 20,
                          height: 20,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      ></i>
                      : <i
                        className="fas fa-times text-red-500 border border-gray-300 rounded-full"
                        style={{
                          width: 20,
                          height: 20,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      ></i>
                  }</td>
                ))}
              </tr>
            ))}

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
          <span className="text-gray-700">{startIdx + 1} - {Math.min(startIdx + itemsPerPage, dummyData.length)} of {dummyData.length}</span>
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
    </div>
  );
};

export default MonthtyAtteData;
