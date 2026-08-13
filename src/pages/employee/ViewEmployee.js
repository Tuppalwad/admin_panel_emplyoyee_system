import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees, deleteEmployee, updateEmployee, closeEmployeeAccount, updateEmployeeInfo } from '../../redux/actions/employeeActions';
import { EditEmployeePopup } from '../../components/popup';
import AgGridTable from '../../components/common/AgGridTable';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

/* Offboarding is blocked while the employee still holds assets — the backend
   returns them in `data` so HR can see what to reclaim. */
const extractBlockedAssets = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.assets)) return data.assets;
  return [];
};

function ViewEmployee() {
  const dispatch = useDispatch();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [blockedOffboarding, setBlockedOffboarding] = useState(null);

  const employee = useSelector((state) => state.employee);
  const { allEmployees = [] } = employee || {};

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch]);

  const notify = useCallback((message) => toast(message), []);

  const handleDelete = useCallback(
    (empId) => {
      if (window.confirm('Are you sure you want to delete this employee?')) {
        dispatch(deleteEmployee(empId));
      }
    },
    [dispatch]
  );

  const handleClose = async (empId, status) => {
    try {
      if (
        window.confirm(
          `Are you sure you want to ${status ? 'close':'open'
          } this employee account?`
        )
      ) {
        const res = await dispatch(closeEmployeeAccount(empId));

        console.log("Response:", res);

        if (res?.status === 'success') {
          notify(
            `Employee account ${status ? 'closed' : 'opened'} successfully`
          );
        } else {
          const stillAssigned = extractBlockedAssets(res?.data);

          if (stillAssigned.length) {
            setBlockedOffboarding({ empId, assets: stillAssigned });
          } else {
            notify(
              res?.message ||
              'Unable to update employee account status'
            );
          }
        }
      }
    } catch (err) {
      console.log("Actual Error:", err);

      notify(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong'
      );
    }
  };

  const handleEdit = useCallback((employeeData) => {
    setSelectedEmployee(employeeData);
    setIsEditPopupOpen(true);
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, allEmployees]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (gridApi) {
      gridApi.setQuickFilter(value);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const value = Number(event.target.value);
    setItemsPerPage(value);
    if (gridApi) {
      gridApi.paginationSetPageSize(value);
    }
  };

  const handlePreviousPage = () => {
    if (gridApi) {
      gridApi.paginationGoToPreviousPage();
    }
  };

  const handleNextPage = () => {
    if (gridApi) {
      gridApi.paginationGoToNextPage();
    }
  };

  const ActionCellRenderer = useCallback(
    (props) => {
      const employeeData = props.data;

      return (
        <div className="flex items-center gap-2 h-full">

          <button
            onClick={() => handleEdit(employeeData)}
            className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            <i className="fas fa-edit"></i>
          </button>

          <button
            onClick={() => handleDelete(employeeData.empId)}
            className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <i className="fas fa-trash"></i>
          </button>

          <button
            onClick={() =>
              handleClose(
                employeeData.empId,
                employeeData.status
              )
            }
            className={`w-8 h-8 rounded-lg transition ${employeeData.status ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
          >
            {employeeData.status ? (
              <i className="fas fa-lock-open"></i>
            ) : (
              <i className="fas fa-lock"></i>
            )}
          </button>

        </div>
      );
    },
    [handleClose, handleDelete, handleEdit]
  );


  const columnDefs = useMemo(
    () => [
      { headerName: 'Employee ID', field: 'empId', filter: true, sortable: true, flex: 1, minWidth: 140 },
      { headerName: 'Current Employee ID', field: 'currentEmpId', filter: true, sortable: true, flex: 1, minWidth: 170 },
      // { headerName: 'Full Name', field: 'fullName', filter: true, sortable: true, flex: 1, minWidth: 180 },
      { headerName: 'First Name', field: 'firstName', filter: true, sortable: true, flex: 1, minWidth: 180 },
      { headerName: 'Last Name', field: 'lastName', filter: true, sortable: true, flex: 1, minWidth: 180 },
      { headerName: 'Email', field: 'email', filter: true, sortable: true, flex: 1, minWidth: 220 },
      { headerName: 'Phone Number', field: 'mobile', filter: true, sortable: true, flex: 1, minWidth: 180 },
      {
        headerName: 'Date of Joining',
        field: 'dateofjoining',
        filter: 'agDateColumnFilter',
        sortable: true,
        flex: 1,
        minWidth: 220,
        valueFormatter: (params) => {
          if (!params.value) return '';

          const date = new Date(params.value);

          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        }
      },
      { headerName: 'Designation', field: 'role', filter: true, sortable: true, flex: 1, minWidth: 140 },
      { headerName: 'Gender', field: 'gender', filter: true, sortable: true, flex: 1, minWidth: 120 },
      { headerName: 'Work Type', field: 'worktype', filter: true, sortable: true, flex: 1, minWidth: 140 },
      { headerName: 'Employee Type', field: 'employeeType', filter: true, sortable: true, flex: 1, minWidth: 180 },
      
      {
        headerName: 'Actions', field: 'actions', minWidth: 150, cellRenderer: 'actionCellRenderer', suppressMovable: true, pinned: 'right',
        filter: false
      },
      {
        headerName: 'Status',
        field: 'status',
        minWidth: 130,
        cellRenderer: (params) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${params.data.status
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              }`}
          >
            {params.data.status ? 'Active' : 'Inactive'}
          </span>
        ),
      },

    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
      minWidth: 120,
      flex: 1,
    }),
    []
  );

  const components = useMemo(() => ({ actionCellRenderer: ActionCellRenderer }), [ActionCellRenderer]);

  const totalRows = allEmployees.length;
  const currentPageNumber = gridApi ? gridApi.paginationGetCurrentPage() : 0;
  const currentStart = totalRows === 0 ? 0 : currentPageNumber * itemsPerPage + 1;
  const currentEnd = totalRows === 0 ? 0 : Math.min((currentPageNumber + 1) * itemsPerPage, totalRows);
  const pageCount = gridApi ? gridApi.paginationGetTotalPages() : Math.ceil(totalRows / itemsPerPage);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <ToastContainer />

      {/* Header */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Employees
            </h1>

            <p className="text-slate-500 mt-2">
              Manage employee records, roles and account access.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
              <p className="text-xs text-blue-600">
                Total Employees
              </p>

              <h3 className="text-xl font-bold text-blue-700">
                {allEmployees.length}
              </h3>
            </div>

            <Link
              to="/dashboard/employee/add"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Employee
            </Link>

          </div>

        </div>

      </div>


      {/* Table */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <AgGridTable
          rowData={allEmployees}
          columnDefs={columnDefs}
          gridOptions={{ defaultColDef }}
          onGridReady={onGridReady}
          components={components}
          rowSelection={{ type: 'single' }}
          pagination={true}
          paginationPageSize={itemsPerPage}
          overlayNoRowsTemplate='<span>No employees found.</span>'
          style={{ height: 600 }}
          className="rounded-2xl"
        />

      </div>

      {/* Offboarding blocked by unreturned assets */}
      {blockedOffboarding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">

            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Assets Still Assigned
                </h3>

                <p className="text-orange-50 text-sm mt-1">
                  {blockedOffboarding.empId} must return these before the account can be closed
                </p>
              </div>

              <button
                onClick={() => setBlockedOffboarding(null)}
                className="text-white/80 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-3 pr-4">Asset ID</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Brand / Model</th>
                    <th className="py-3 pr-4">Serial Number</th>
                  </tr>
                </thead>

                <tbody>
                  {blockedOffboarding.assets.map((asset, index) => (
                    <tr key={asset._id || asset.assetId || index} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {asset.assetId}
                      </td>

                      <td className="py-3 pr-4">{asset.category}</td>

                      <td className="py-3 pr-4">
                        {asset.brand} {asset.modelName}
                      </td>

                      <td className="py-3 pr-4">{asset.serialNumber || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setBlockedOffboarding(null)}
                className="px-4 py-2 rounded-lg text-sm text-slate-600 border border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>

              <Link
                to={`/dashboard/asset/employee?empId=${encodeURIComponent(blockedOffboarding.empId)}`}
                className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Reclaim Assets
              </Link>
            </div>

          </div>
        </div>
      )}

      {isEditPopupOpen && (
        <EditEmployeePopup
          employee={selectedEmployee}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={(formData) => {
            setIsEditPopupOpen(false);
            const result = dispatch(updateEmployeeInfo(formData));
            if (result) {
              toast.success('Employee updated successfully');
            } else {
              toast.error('Failed to update employee');
            }
          }}
        />
      )}

    </div>

  );
}

export default ViewEmployee;
