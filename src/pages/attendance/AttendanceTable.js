import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { EmployeeAttendanceInfo } from '../../components/popup';
import { useDispatch } from 'react-redux';
import { getAttendanceToday } from '../../redux/actions/attendance';
import AgGridTable from '../../components/common/AgGridTable';
import moment from 'moment';

const AttendanceTable = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
    const dispatch = useDispatch();

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const handleRowClick = useCallback((event) => {
        setSelectedEmployee(event.data);
    }, []);

    const getAttendanceData = async () => {
        try {
            setLoading(true);
            const response = await dispatch(getAttendanceToday());
            setAttendanceData(response?.data || []);
        } catch (error) {
            console.log(error);
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAttendanceData();
    }, []);

    const ImageCellRenderer = useCallback(
        () => (
            <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="rounded-full h-10 w-10"
            />
        ),
        []
    );

    const StatusCellRenderer = useCallback((props) => {
        const status = props.value;
        const isPresent = status === 'Present';
        return (
            <span
                className={`px-2 py-1 rounded-full ${
                    isPresent ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
            >
                {status}
            </span>
        );
    }, []);

    const columnDefs = useMemo(
        () => [
            {
                headerName: 'Image',
                field: 'image',
                cellRenderer: 'imageCellRenderer',
                sortable: false,
                filter: false,
                minWidth: 90,
                maxWidth: 90,
            },
            {
                headerName: 'Name',
                field: 'fullName',
                valueGetter: (params) => {
                    const name = params.data?.fullName || '';
                    return name.length > 25 ? `${name.slice(0, 25)}...` : name;
                },
                minWidth: 180,
            },
            {
                headerName: 'First In',
                valueGetter: (params) =>
                    params.data?.inTime
                        ? moment(params.data.inTime).utc().format('hh:mm A')
                        : '-',
                minWidth: 120,
            },
            {
                headerName: 'Last Out',
                valueGetter: (params) =>
                    params.data?.outTime
                        ? moment(params.data.outTime).utc().format('hh:mm A')
                        : '-',
                minWidth: 120,
            },
            { headerName: 'Shift', field: 'shift', minWidth: 120 },
            { headerName: 'Total Hours', field: 'totalHours', minWidth: 130 },
            {
                headerName: 'Status',
                field: 'status',
                cellRenderer: 'statusCellRenderer',
                minWidth: 130,
            },
        ],
        []
    );

    const components = useMemo(
        () => ({
            imageCellRenderer: ImageCellRenderer,
            statusCellRenderer: StatusCellRenderer,
        }),
        [ImageCellRenderer, StatusCellRenderer]
    );

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Today's Attendance</h1>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                <AgGridTable
                    rowData={attendanceData}
                    columnDefs={columnDefs}
                    gridOptions={{
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
                    onRowClicked={handleRowClick}
                    components={components}
                    getRowId={(params) => params.data.empId}
                    pagination={true}
                    paginationPageSize={itemsPerPage}
                    overlayNoRowsTemplate='<span class="text-slate-500">No attendance records found</span>'
                    style={{ height: 540 }}
                    className="rounded-3xl"
                    rowStyle={{ cursor: 'pointer' }}
                />
            </div>

            {selectedEmployee && (
                <EmployeeAttendanceInfo
                    onClose={handleCloseModal}
                    empId={selectedEmployee.empId}
                />
            )}
        </div>
    );
};

export default AttendanceTable;
