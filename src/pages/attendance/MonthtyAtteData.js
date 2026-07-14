// src/Attendance.js
import React, { useEffect, useState } from 'react';
import { getMonthlyAttendance } from '../../redux/actions/attendance';
import { useDispatch } from 'react-redux';

const itemsPerPageOptions = [5, 10, 15];

const MonthtyAtteData = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

  const [employeeData, setEmployeeData] = useState([]);
  const dispatch = useDispatch();

  const fetchMonthlyData = async () => {
    const data = {
      month: new Date(startDate).getMonth() + 1,
      year: new Date(startDate).getFullYear(),
    };

    const res = await dispatch(getMonthlyAttendance(data));
    if (res.code === 200) {
      setEmployeeData(res.data);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [startDate]);

  // Apply filters
  const filteredData = employeeData?.filter((employee) => 
    employee.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return employeeData ? (

  <div className="p-6 bg-slate-50 min-h-screen">


{/* Header */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

    <div>
      <h1 className="text-2xl font-bold text-slate-800">
        Monthly Attendance
      </h1>
      <p className="text-slate-500 text-sm mt-1">
        Employee monthly attendance overview
      </p>
    </div>

    <div className="flex flex-wrap gap-3">

      <div className="relative">
        <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="date"
        value={startDate.toISOString().substring(0, 10)}
        className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
    </div>
  </div>
</div>

{/* Table */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead>

        <tr className="bg-slate-100">

          <th className="sticky left-0 z-20 bg-slate-100 px-6 py-4 text-left text-sm font-semibold text-slate-700 border-r">
            Employee
          </th>

          {Array.from({ length: daysInMonth }, (_, i) => (
            <th
              key={i}
              className="px-3 py-4 text-center text-xs font-semibold text-slate-600 border-r"
            >
              {i + 1}
            </th>
          ))}

          <th className="px-4 py-4 text-center text-green-600 font-semibold">
            P
          </th>

          <th className="px-4 py-4 text-center text-red-600 font-semibold">
            A
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredData
          .slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
          .map((employee) => {

            const presentCount =
              employee.attendanceRecords.filter(
                (x) => x.status === 'Present'
              ).length;

            const absentCount =
              employee.attendanceRecords.filter(
                (x) => x.status === 'Absent'
              ).length;

            return (
              <tr
                key={employee.empId}
                className="hover:bg-slate-50 transition"
              >

                <td className="sticky left-0 bg-white z-10 px-6 py-4 border-r font-medium text-slate-700 whitespace-nowrap">
                  {employee.fullName}
                </td>

                {Array.from(
                  { length: daysInMonth },
                  (_, i) => {
                    const day = i + 1;

                    const attendanceRecord =
                      employee.attendanceRecords.find(
                        (record) =>
                          new Date(record.date).getDate() === day
                      );

                    return (
                      <td
                        key={i}
                        className="text-center border-r p-2"
                      >
                        {attendanceRecord ? (
                          attendanceRecord.status === 'Present' ? (
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                              <i className="fas fa-check text-green-600 text-xs"></i>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                              <i className="fas fa-times text-red-600 text-xs"></i>
                            </div>
                          )
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 mx-auto"></div>
                        )}
                      </td>
                    );
                  }
                )}

                <td className="text-center font-bold text-green-600">
                  {presentCount}
                </td>

                <td className="text-center font-bold text-red-600">
                  {absentCount}
                </td>

              </tr>
            );
          })}

      </tbody>

    </table>

  </div>
</div>

{/* Pagination */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mt-4 flex flex-wrap justify-between items-center">

  <div className="text-sm text-slate-500">
    Showing {(currentPage - 1) * itemsPerPage + 1} -
    {Math.min(
      currentPage * itemsPerPage,
      filteredData.length
    )}{' '}
    of {filteredData.length}
  </div>

  <div className="flex items-center gap-3">

    <select
      value={itemsPerPage}
      onChange={handleItemsPerPageChange}
      className="border border-slate-200 rounded-lg px-3 py-2"
    >
      {itemsPerPageOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <button
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage - 1)}
      className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
    >
      <i className="fas fa-chevron-left"></i>
    </button>

    <span className="font-medium text-slate-700">
      {currentPage}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => handlePageChange(currentPage + 1)}
      className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
    >
      <i className="fas fa-chevron-right"></i>
    </button>

  </div>

</div>

  </div>

  ) : (
    <div>Loading...</div>
  );
};

export default MonthtyAtteData;
