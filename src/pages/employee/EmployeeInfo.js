import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmpStatus, searchDataOnFilter } from '../../redux/actions/employeeActions';
import EmployeeInfoPopup from '../../components/popup/EmployeeInfoPopup';
import AgGridTable from '../../components/common/AgGridTable';
import { experienceRange, skills } from '../../utils/utils';
import Select from "react-select";
import { debounce } from 'lodash';

function EmployeeInfo() {
    const dispatch = useDispatch();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
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
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
    };

    const itemsPerPageOptions = [5, 10, 15];

    const handleEdit = useCallback((employee) => {
        setSelectedEmployee(employee);
        setIsEditPopupOpen(true);
    }, []);

    const ActionCellRenderer = useCallback(
        (props) => (
            <button
                type="button"
                className="text-blue-700 hover:text-blue-900 text-lg cursor-pointer"
                onClick={() => handleEdit(props.data)}
                title="View Details"
            >
                <i className="fas fa-eye"></i>
            </button>
        ),
        [handleEdit]
    );

    const columnDefs = useMemo(
        () => [
            { headerName: 'Employee ID', field: 'empId', minWidth: 130 },
            {
                headerName: 'Full Name',
                valueGetter: (params) => {
                    const first = params.data?.FirstName || '';
                    const middle = params.data?.MiddleName || '';
                    const last = params.data?.LastName || '';
                    return `${first} ${middle} ${last}`.trim();
                },
                minWidth: 200,
            },
            {
                headerName: 'Skill',
                valueGetter: (params) => params.data?.skillAndExperience?.[0]?.skill || '',
                minWidth: 150,
            },
            {
                headerName: 'Experience',
                valueGetter: (params) => params.data?.skillAndExperience?.[0]?.experience || '',
                minWidth: 150,
            },
            { headerName: 'Total Work Experience', field: 'workExperience', minWidth: 170 },
            { headerName: 'Project Name', field: 'currentlyWrokingProject', minWidth: 170 },
            { headerName: 'Contact No', field: 'ContactNo', minWidth: 150 },
            { headerName: 'Education', field: 'education', minWidth: 150 },
            {
                headerName: 'Year of Passing',
                valueGetter: (params) => {
                    const year = params.data?.YearOfPassing;
                    return year ? new Date(year).getFullYear() : '';
                },
                minWidth: 140,
            },
            {
                headerName: 'Status',
                field: 'status',
                cellClass: (params) => (params.value === 'Approve' ? 'text-green-700' : 'text-red-700'),
                minWidth: 120,
            },
            {
                headerName: 'Actions',
                field: 'actions',
                cellRenderer: 'actionCellRenderer',
                sortable: false,
                filter: false,
                minWidth: 120,
                pinned: 'right',
                suppressMovable: true,
                cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            },

        ],
        [ActionCellRenderer]
    );




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
     <div className={`p-6 bg-slate-50 min-h-screen ${!isSidebarOpen ? 'w-full' : ''}`}>

  {/* Header */}
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Employee Information
        </h1>

        <p className="text-slate-500 mt-2">
          View and manage employee information, approvals, and account details.
        </p>
      </div>

      <div className="flex gap-3">

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
          <p className="text-xs text-blue-600">
            Total Employees
          </p>

          <h3 className="text-xl font-bold text-blue-700">
            {filteredData?.length || 0}
          </h3>
        </div>

      </div>

    </div>

  </div>

  {/* Table Section */}
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

    {/* Section Header */}
    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">

      <div>
        <h2 className="font-semibold text-slate-800">
          Employee Records
        </h2>

        <p className="text-sm text-slate-500">
          Complete employee information list
        </p>
      </div>

      <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-600">
        {filteredData?.length || 0} Records
      </div>

    </div>

    {/* AG Grid */}
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
      overlayNoRowsTemplate="<span>No employee data found</span>"
      style={{ height: 600 }}
      className="rounded-2xl"
    />

  </div>

   

  {/* Popup */}
  {isEditPopupOpen && (
    <EmployeeInfoPopup
      employee={selectedEmployee}
      onClose={() => setIsEditPopupOpen(false)}
      reject={() => handleReject(selectedEmployee.empId)}
      approve={() => handleApprove(selectedEmployee.empId)}
    />
  )}

</div>
    );
}

export default EmployeeInfo;



