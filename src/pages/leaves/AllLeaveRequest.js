// src/LeaveManagement.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import LeaveReq from '../../components/popup/LeaveReq';
import { useDispatch, useSelector } from 'react-redux';
import { getallEmpLeaves, setStatusofLeave } from '../../redux/actions/leaveAction';
import AgGridTable from '../../components/common/AgGridTable';

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
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
  };

  const handleViewClick = useCallback((leave) => {
    setSelectedLeave(leave);
    setPopupVisible(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setPopupVisible(false);
    setSelectedLeave(null);
  }, []);

  const handleStatusChange = async (status) => {
    if (!selectedLeave || selectedLeave.status !== 'Pending') {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDate = new Date(selectedLeave.startDate);
    fromDate.setHours(0, 0, 0, 0);

    if (fromDate < today) {
      return;
    }

    const updatedLeave = { leaveId: selectedLeave._id, empId: selectedLeave.empId, status };
    await dispatch(setStatusofLeave(updatedLeave));
    handleClosePopup();
  };

  const ActionCellRenderer = useCallback(
    (props) => (
      <button
        type="button"
        className="text-blue-700 hover:text-blue-900 text-lg cursor-pointer"
        onClick={() => handleViewClick(props.data)}
        title="View Details"
      >
        <i className="fas fa-eye"></i>
      </button>
    ),
    [handleViewClick]
  );

  const columnDefs = useMemo(
    () => [
      { headerName: 'Name', field: 'fullName', minWidth: 150 },
      { headerName: 'Leave Type', field: 'type', minWidth: 130 },
      {
        headerName: 'Leave From',
        valueGetter: (params) => new Date(params.data?.startDate).toLocaleDateString(),
        minWidth: 130,
      },
      {
        headerName: 'Leave To',
        valueGetter: (params) => new Date(params.data?.endDate).toLocaleDateString(),
        minWidth: 130,
      },
      {
        headerName: 'No. of Days',
        valueGetter: (params) => {
          const start = new Date(params.data?.startDate);
          const end = new Date(params.data?.endDate);
          return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        },
        minWidth: 120,
      },
      {
        headerName: 'Reason',
        valueGetter: (params) => {
          const reason = params.data?.reason || '';
          return reason.length > 30 ? reason.substring(0, 30) + '...' : reason;
        },
        minWidth: 200,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellClass: (params) => {
          const status = params.value;
          if (status === 'Approved') return 'text-green-600';
          if (status === 'Pending') return 'text-yellow-600';
          return 'text-red-600';
        },
        minWidth: 120,
      },
      {
        headerName: 'Action',
        field: 'actions',
        cellRenderer: 'actionCellRenderer',
        sortable: false,
        filter: false,
        minWidth: 100,
      },
      {
  headerName: 'Status',
  field: 'status',
  minWidth: 130,
  cellRenderer: (params) => {
    const status = params.value;

    const styles = {
      Approved: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Rejected: 'bg-red-100 text-red-700',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {status}
      </span>
    );
  },
}
    ],
    [ActionCellRenderer]
  );

  // Filter leaves data
  const filteredData = leaves.filter(leave =>
    leave.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || leave.empId.includes(searchTerm)
  );

  return (
  <div className="p-6 bg-slate-50 min-h-screen">

    {/* Header */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Leave Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage employee leave requests and approvals.
          </p>
        </div>

        <div className="flex gap-3">

          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-5 py-3">
            <p className="text-xs text-yellow-600">
              Pending
            </p>

            <h3 className="text-xl font-bold text-yellow-700">
              {leaves.filter(x => x.status === 'Pending').length}
            </h3>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3">
            <p className="text-xs text-green-600">
              Approved
            </p>

            <h3 className="text-xl font-bold text-green-700">
              {leaves.filter(x => x.status === 'Approved').length}
            </h3>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3">
            <p className="text-xs text-red-600">
              Rejected
            </p>

            <h3 className="text-xl font-bold text-red-700">
              {leaves.filter(x => x.status === 'Rejected').length}
            </h3>
          </div>

        </div>

      </div>

    </div>
 

    {/* Table */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">

        <div>
          <h2 className="font-semibold text-slate-800">
            Leave Requests
          </h2>

          <p className="text-sm text-slate-500">
            Review and manage employee leave applications.
          </p>
        </div>

      </div>

      <AgGridTable
        rowData={filteredData}
        columnDefs={columnDefs}
        gridOptions={{
          animateRows: true,
          rowHeight: 55,
          headerHeight: 55,
          defaultColDef: {
            flex: 1,
            minWidth: 120,
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
          },
        }}
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        components={{
          actionCellRenderer: ActionCellRenderer,
        }}
        pagination={true}
        paginationPageSize={itemsPerPage}
        overlayNoRowsTemplate="<span>No leave requests found</span>"
        style={{ height: 600 }}
        className="rounded-2xl"
      />

    </div>

    {/* Popup */}
    {popupVisible && selectedLeave && (
      <LeaveReq
        selectedLeave={selectedLeave}
        handleClosePopup={handleClosePopup}
        handleStatusChange={handleStatusChange}
      />
    )}

  </div>
);
};

export default AllLeaveRequest;
