import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmpStatus, searchDataOnFilter } from '../../redux/actions/employeeActions';
import EmployeeInfoPopup from '../../components/popup/EmployeeInfoPopup';
import AgGridTable from '../../components/common/AgGridTable';
import { experienceRange, exportToExcel, skills } from '../../utils/utils';
import Select from "react-select";
import { debounce } from 'lodash';

const formatExportDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
};

const exportColumns = [
    // Personal Information
    { key: 'fullName', label: 'Full Name', section: 'Personal Information', accessor: (row) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() },
    { key: 'fathersName', label: "Father's Name", section: 'Personal Information', accessor: (row) => row?.fathersName || '' },
    { key: 'gender', label: 'Gender', section: 'Personal Information', accessor: (row) => row?.gender || '' },
    { key: 'dob', label: 'Date of Birth', section: 'Personal Information', accessor: (row) => formatExportDate(row?.dob) },
    { key: 'maritalStatus', label: 'Marital Status', section: 'Personal Information', accessor: (row) => row?.maritalStatus || '' },
    { key: 'spouseName', label: 'Spouse Name', section: 'Personal Information', accessor: (row) => row?.spouseName || '' },
    { key: 'currentCity', label: 'Current City', section: 'Personal Information', accessor: (row) => row?.currentCity || '' },

    // Employment Information
    { key: 'empId', label: 'Employee ID', section: 'Employment Information', accessor: (row) => row?.empId || '' },
    { key: 'currentEmpId', label: 'Current Employee ID', section: 'Employment Information', accessor: (row) => row?.currentEmpId || '' },
    { key: 'dateOfJoining', label: 'Date Of Joining', section: 'Employment Information', accessor: (row) => formatExportDate(row?.dateOfJoining) },
    { key: 'designation', label: 'Designation', section: 'Employment Information', accessor: (row) => row?.designation || '' },
    { key: 'employmentType', label: 'Employment Type', section: 'Employment Information', accessor: (row) => row?.employmentType || '' },
    { key: 'workMode', label: 'Work Mode', section: 'Employment Information', accessor: (row) => row?.workMode || '' },
    { key: 'status', label: 'Status', section: 'Employment Information', accessor: (row) => row?.status || '' },

    // Contact Information
    { key: 'email', label: 'Email', section: 'Contact Information', accessor: (row) => row?.email || '' },
    { key: 'mobileNo', label: 'Mobile Number', section: 'Contact Information', accessor: (row) => row?.mobileNo || '' },
    { key: 'emergencyContactNo', label: 'Emergency Contact', section: 'Contact Information', accessor: (row) => row?.emergencyContactNo || '' },
    { key: 'emergencyContactPersonName', label: 'Emergency Contact Person', section: 'Contact Information', accessor: (row) => row?.emergencyContactPersonName || '' },

    // Education & Experience
    { key: 'highestQualification', label: 'Highest Qualification', section: 'Education & Experience', accessor: (row) => row?.highestQualification || '' },
    { key: 'additionalCourses', label: 'Additional Courses', section: 'Education & Experience', accessor: (row) => row?.additionalCourses || '' },
    { key: 'totalExp', label: 'Total Experience', section: 'Education & Experience', accessor: (row) => row?.totalExp || '' },
    {
        key: 'skills',
        label: 'Skills',
        section: 'Education & Experience',
        accessor: (row) =>
            row?.skills?.length
                ? row.skills.map((item) => `${item.skill} (${item.experience} Year)`).join(', ')
                : '',
    },

    // Identity Documents
    { key: 'panNo', label: 'PAN Number', section: 'Identity Documents', accessor: (row) => row?.panNo || '' },
    { key: 'aadharNo', label: 'Aadhar Number', section: 'Identity Documents', accessor: (row) => row?.aadharNo || '' },
    { key: 'passportNo', label: 'Passport Number', section: 'Identity Documents', accessor: (row) => row?.passportNo || '' },
    { key: 'nameAsPerAadhar', label: 'Name As Per Aadhar', section: 'Identity Documents', accessor: (row) => row?.nameAsPerAadhar || '' },

    // Bank Information
    { key: 'bankAccountNo', label: 'Bank Account Number', section: 'Bank Information', accessor: (row) => row?.bankAccountNo || '' },
    { key: 'ifscCode', label: 'IFSC Code', section: 'Bank Information', accessor: (row) => row?.ifscCode || '' },
    { key: 'pfMember', label: 'PF Member', section: 'Bank Information', accessor: (row) => row?.pfMember || '' },
    { key: 'uanNo', label: 'UAN Number', section: 'Bank Information', accessor: (row) => row?.uanNo || '' },

    // Laptop Information
    { key: 'laptopType', label: 'Laptop Type', section: 'Laptop Information', accessor: (row) => row?.laptopType || '' },
    { key: 'havingOfficialInUse', label: 'Official Laptop In Use', section: 'Laptop Information', accessor: (row) => row?.havingOfficialInUse || '' },
    { key: 'officialLaptopSrNo', label: 'Official Laptop Serial No.', section: 'Laptop Information', accessor: (row) => row?.officialLaptopSrNo || '' },
    { key: 'ram', label: 'RAM', section: 'Laptop Information', accessor: (row) => row?.ram || '' },
    { key: 'storageType', label: 'Storage Type', section: 'Laptop Information', accessor: (row) => row?.storageType || '' },
    { key: 'storageSpace', label: 'Storage Space', section: 'Laptop Information', accessor: (row) => row?.storageSpace || '' },
    { key: 'officialUpgrades', label: 'Official Upgrades', section: 'Laptop Information', accessor: (row) => row?.officialUpgrades || '' },
    { key: 'additionalConfigurations', label: 'Additional Configurations', section: 'Laptop Information', accessor: (row) => row?.additionalConfigurations || '' },
];

const exportSections = [...new Set(exportColumns.map((col) => col.section))];

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
    const [data, setData] = useState();
    const [loading, setLoading] = useState();
    const [isExportPopupOpen, setIsExportPopupOpen] = useState(false);
    const [selectedExportColumns, setSelectedExportColumns] = useState(
        exportColumns.map((col) => col.key)
    );

    const fetchdataonSearch = useCallback(async () => {
        try {
            const getSkill = selectedSkill?.map(item => item.value) || []; // Avoid error if selectedSkill is null
            const data = { name: searchTerm, skill: getSkill, experience: selectedExperience?.value };

            const res = await dispatch(searchDataOnFilter(data));

            if (res.code === 200 && res.data) {
                setFilterData(res.data);
                setData(res.data)
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
                    const first = params.data?.firstName || '';
                    const middle = params.data?.middleName || '';
                    const last = params.data?.lastName || '';
                    return `${first} ${middle} ${last}`.trim();
                },
                minWidth: 200,
            },
            {
                headerName: 'Skill',
                valueGetter: (params) => params.data?.skills?.[0]?.skill || '',
                minWidth: 150,
            },
            {
                headerName: 'Experience',
                valueGetter: (params) => params.data?.skills?.[0]?.experience || '',
                minWidth: 150,
            },
            { headerName: 'Total Work Experience', field: 'totalExp', minWidth: 170 },
            // { headerName: 'Project Name', field: 'currentlyWrokingProject', minWidth: 170 },
            { headerName: 'Contact No', field: 'mobileNo', minWidth: 150 },
            { headerName: 'Education', field: 'highestQualification', minWidth: 150 },
            // {
            //     headerName: 'Year of Passing',
            //     valueGetter: (params) => {
            //         const year = params.data?.YearOfPassing;
            //         return year ? new Date(year).getFullYear() : '';
            //     },
            //     minWidth: 140,
            // },
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

    const downloadExcle = () => {
        setSelectedExportColumns(exportColumns.map((col) => col.key));
        setIsExportPopupOpen(true);
    };

    const toggleExportColumn = (key) => {
        setSelectedExportColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const toggleSelectAllExportColumns = () => {
        setSelectedExportColumns((prev) =>
            prev.length === exportColumns.length ? [] : exportColumns.map((col) => col.key)
        );
    };

    const confirmExportExcel = () => {
        const columnsToExport = exportColumns.filter((col) => selectedExportColumns.includes(col.key));
        const rows = (data || []).map((row) => {
            const exportRow = {};
            columnsToExport.forEach((col) => {
                exportRow[col.label] = col.accessor(row);
            });
            return exportRow;
        });

        setIsExportPopupOpen(false);
        setLoading(true);
        exportToExcel(rows, "Employees");
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className={`p-4 bg-slate-50 min-h-screen ${!isSidebarOpen ? 'w-full' : ''}`}>

            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">

                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Employee Information
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            View and manage employee information, approvals, and account details.
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
                            <p className="text-xs text-blue-600">
                                Total Employees
                            </p>

                            <h3 className="text-lg font-bold text-blue-700">
                                {filteredData?.length || 0}
                            </h3>
                        </div>

                    </div>

                </div>

            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Section Header */}
                <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">

                    <div>
                        <h2 className="font-semibold text-slate-800">
                            Employee Records
                        </h2>

                        <p className="text-sm text-slate-500">
                            Complete employee information list
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={downloadExcle}
                            className="bg-blue-100 px-4 py-2 rounded-lg text-sm text-slate-600">
                            {loading ? <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> : <i className="fas fa-download" style={{ marginRight: '8px' }}></i>}
                            {loading ? 'Loading...' : 'Export Excel'}
                        </button>
                        <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-600">
                            {filteredData?.length || 0} Records
                        </div>
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
                    style={{ height: 460 }}
                    className="rounded-xl"
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

            {/* Export Columns Popup */}
            {isExportPopupOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

                        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Select Columns to Export</h3>
                            <button
                                onClick={() => setIsExportPopupOpen(false)}
                                className="text-white/80 hover:text-white text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <label className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedExportColumns.length === exportColumns.length}
                                    onChange={toggleSelectAllExportColumns}
                                    className="w-4 h-4"
                                />
                                <span className="font-medium text-slate-800">Select All</span>
                            </label>

                            {exportSections.map((section) => (
                                <div key={section} className="mb-5">
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                        {section}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {exportColumns
                                            .filter((col) => col.section === section)
                                            .map((col) => (
                                                <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExportColumns.includes(col.key)}
                                                        onChange={() => toggleExportColumn(col.key)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-slate-700 text-sm">{col.label}</span>
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setIsExportPopupOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm text-slate-600 border border-slate-300 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmExportExcel}
                                disabled={selectedExportColumns.length === 0}
                                className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Export
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default EmployeeInfo;



