import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProjects } from '../../redux/actions/projectAction';
import AgGridTable from '../../components/common/AgGridTable';

const ViewProjects = () => {
const dispatch = useDispatch();

const { projects = [], refresh } = useSelector(
(state) => state.projects
);

const [searchTerm, setSearchTerm] = useState('');
const [gridApi, setGridApi] = useState(null);

useEffect(() => {
dispatch(getProjects());
}, [dispatch, refresh]);

const onGridReady = useCallback((params) => {
setGridApi(params.api);
params.api.sizeColumnsToFit();
}, []);

const handleSearchChange = (event) => {
const value = event.target.value;
setSearchTerm(value);

if (gridApi) {
  gridApi.setGridOption('quickFilterText', value);
}

};

const PriorityCellRenderer = useCallback((props) => {
const priority = props.value;

const styles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

return (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      styles[priority] || 'bg-slate-100 text-slate-700'
    }`}
  >
    {priority}
  </span>
);

}, []);

const StatusCellRenderer = useCallback((props) => {
const status = props.value;

const styles = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
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

}, []);

const ActionCellRenderer = useCallback(
(props) => ( <div className="flex items-center gap-2">
<Link
to={`/dashboard/project/projectDetail/${props.data._id}`}
className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
>
View </Link> </div>
),
[]
);

const columnDefs = useMemo(
() => [
{
headerName: 'Project',
field: 'projectTitle',
minWidth: 220,
},
{
headerName: 'Department',
field: 'department',
minWidth: 150,
},
{
headerName: 'Manager',
valueGetter: (params) =>
params.data?.manager?.[0]?.name || '-',
minWidth: 170,
},
{
headerName: 'Priority',
field: 'projectPriority',
cellRenderer: 'priorityCellRenderer',
minWidth: 140,
},
{
headerName: 'Status',
field: 'workStatus',
cellRenderer: 'statusCellRenderer',
minWidth: 150,
},
{
headerName: 'Start Date',
valueGetter: (params) =>
params.data?.projectStartDate
? new Date(
params.data.projectStartDate
).toLocaleDateString()
: '-',
minWidth: 150,
},
{
headerName: 'End Date',
valueGetter: (params) =>
params.data?.projectEndDate
? new Date(
params.data.projectEndDate
).toLocaleDateString()
: '-',
minWidth: 150,
},
{
headerName: 'Actions',
cellRenderer: 'actionCellRenderer',
sortable: false,
filter: false,
minWidth: 140,
pinned: 'right',
},
],
[]
);

const components = useMemo(
() => ({
priorityCellRenderer: PriorityCellRenderer,
statusCellRenderer: StatusCellRenderer,
actionCellRenderer: ActionCellRenderer,
}),
[
PriorityCellRenderer,
StatusCellRenderer,
ActionCellRenderer,
]
);

return ( <div className="p-4 bg-slate-50 min-h-screen">

  {/* Header */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">

      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Projects
        </h1>

        <p className="text-sm text-slate-500 mt-0.5">
          Manage and monitor all company projects
        </p>
      </div>

      <div className="flex items-center gap-2">

        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
          <p className="text-xs text-blue-600">
            Total Projects
          </p>

          <h3 className="text-lg font-bold text-blue-700">
            {projects.length}
          </h3>
        </div>

        <Link
          to="/dashboard/project/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Project
        </Link>

      </div>

    </div>
  </div>

  {/* Search — the quick-filter handler already existed but was never given an input to
      drive it, which is why searchTerm/handleSearchChange linted as unused. */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
    <div className="relative w-full">
      <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search anything — title, department, status, priority, client"
        className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 pl-11 pr-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </div>

  {/* Grid */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

    <AgGridTable
      rowData={projects}
      columnDefs={columnDefs}
      components={components}
      onGridReady={onGridReady}
      getRowId={(params) => params.data._id}
      pagination={true}
      paginationPageSize={10}
      overlayNoRowsTemplate="<span>No Projects Found</span>"
      style={{ height: 460 }}
      className="rounded-xl"
      gridOptions={{
        animateRows: true,
        rowHeight: 55,
        headerHeight: 55,
        defaultColDef: {
          sortable: true,
          filter: true,
          floatingFilter: true,
          resizable: true,
          flex: 1,
          minWidth: 120,
        },
      }}
    />

  </div>

</div>

);
};

export default ViewProjects;
