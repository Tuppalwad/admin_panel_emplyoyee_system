import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AgGridTable from '../../components/common/AgGridTable';
import { getAssetCategories, getAssets, searchAssets } from '../../redux/actions/assetAction';
import { conditionColor, formatDate, statusColor } from './assetHelpers';

const EMPTY_FILTERS = { category: '', status: '', condition: '' };

const ViewAssets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assets = [], refresh, enums } = useSelector((state) => state.assets);

  /* Draft state is what the user is editing; `applied` is what was last sent to the
     server. Nothing fires until Search is pressed, so typing costs no API calls. */
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [draftSearch, setDraftSearch] = useState('');
  const [applied, setApplied] = useState({ search: '', filters: EMPTY_FILTERS });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getAssetCategories());
  }, [dispatch]);

  /* The search endpoint does its own regex match and ignores the dropdown filters,
     so the two paths are kept mutually exclusive. */
  const fetchAssets = useCallback(
    ({ search, filters }) => {
      if (search.trim()) {
        dispatch(searchAssets(search.trim()));
        return;
      }

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value)
      );
      dispatch(getAssets(activeFilters));
    },
    [dispatch]
  );

  /* One call on mount, one per Search press, and one per mutation elsewhere
     (`refresh` is a counter, so repeat mutations still re-fire this) */
  useEffect(() => {
    fetchAssets(applied);
  }, [fetchAssets, applied, refresh]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const runSearch = () => {
    setApplied({ search: draftSearch, filters: draftFilters });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      runSearch();
    }
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setDraftSearch('');
    setApplied({ search: '', filters: EMPTY_FILTERS });
  };

  const activeFilterCount = Object.values(applied.filters).filter(Boolean).length;

  const isDirty =
    draftSearch !== applied.search ||
    JSON.stringify(draftFilters) !== JSON.stringify(applied.filters);

  const StatusCellRenderer = useCallback((props) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(props.value)}`}>
      {props.value}
    </span>
  ), []);

  const ConditionCellRenderer = useCallback((props) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionColor(props.value)}`}>
      {props.value}
    </span>
  ), []);

  const ActionCellRenderer = useCallback((props) => (
    <div className="flex items-center gap-2">
      <Link
        to={`/dashboard/asset/detail/${encodeURIComponent(props.data.assetId)}`}
        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
      >
        View
      </Link>
    </div>
  ), []);

  const columnDefs = useMemo(() => [
    { headerName: 'Asset ID', field: 'assetId', minWidth: 160 },
    { headerName: 'Category', field: 'category', minWidth: 140 },
    { headerName: 'Brand', field: 'brand', minWidth: 130 },
    { headerName: 'Model', field: 'modelName', minWidth: 160 },
    { headerName: 'Serial Number', field: 'serialNumber', minWidth: 170 },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: 'statusCellRenderer',
      minWidth: 170,
    },
    {
      headerName: 'Condition',
      field: 'condition',
      cellRenderer: 'conditionCellRenderer',
      minWidth: 150,
    },
    {
      headerName: 'Assigned To',
      valueGetter: (params) =>
        params.data?.currentAssignee?.empId
          ? `${params.data.currentAssignee.empName} (${params.data.currentAssignee.empId})`
          : '-',
      minWidth: 200,
    },
    { headerName: 'Location', field: 'locationType', minWidth: 130 },
    {
      headerName: 'Warranty Expiry',
      valueGetter: (params) => formatDate(params.data?.warrantyExpiryDate),
      minWidth: 160,
    },
    {
      headerName: 'Actions',
      cellRenderer: 'actionCellRenderer',
      sortable: false,
      filter: false,
      minWidth: 130,
      pinned: 'right',
    },
  ], []);

  const components = useMemo(() => ({
    statusCellRenderer: StatusCellRenderer,
    conditionCellRenderer: ConditionCellRenderer,
    actionCellRenderer: ActionCellRenderer,
  }), [StatusCellRenderer, ConditionCellRenderer, ActionCellRenderer]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Assets
            </h1>

            <p className="text-slate-500 mt-1">
              Track company equipment, assignments and condition
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-xl">
              <p className="text-xs text-blue-600">
                Total Assets
              </p>

              <h3 className="text-xl font-bold text-blue-700">
                {assets.length}
              </h3>
            </div>

            <Link
              to="/dashboard/asset/add"
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Asset
            </Link>

          </div>

        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col md:flex-row gap-3 md:items-center">

          <input
            type="text"
            name="search"
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search serial number, brand or model"
            className="shadow appearance-none border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <div className="flex gap-3 shrink-0">

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`px-5 py-3 rounded-xl border transition whitespace-nowrap ${activeFilterCount
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <i className="fas fa-sliders mr-2"></i>
              Filters
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>

            <button
              onClick={runSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition whitespace-nowrap"
            >
              <i className="fas fa-magnifying-glass mr-2"></i>
              Search
            </button>

            <button
              onClick={clearFilters}
              className="px-5 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition whitespace-nowrap"
            >
              <i className="fas fa-rotate-left mr-2"></i>
              Reset
            </button>

          </div>

        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-200">

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>

              <select
                name="category"
                value={draftFilters.category}
                onChange={handleFilterChange}
                disabled={Boolean(draftSearch.trim())}
                className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-slate-100"
              >
                <option value="">All Categories</option>

                {enums.ASSET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>

              <select
                name="status"
                value={draftFilters.status}
                onChange={handleFilterChange}
                disabled={Boolean(draftSearch.trim())}
                className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-slate-100"
              >
                <option value="">All Statuses</option>

                {enums.ASSET_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="condition">
                Condition
              </label>

              <select
                name="condition"
                value={draftFilters.condition}
                onChange={handleFilterChange}
                disabled={Boolean(draftSearch.trim())}
                className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-slate-100"
              >
                <option value="">All Conditions</option>

                {enums.CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {draftSearch.trim() && (
              <p className="text-xs text-slate-500 md:col-span-3">
                Filters are ignored while a search term is present — the search endpoint
                matches on its own.
              </p>
            )}

          </div>
        )}

        {isDirty && (
          <p className="text-xs text-amber-700 mt-3">
            <i className="fas fa-circle-info mr-2"></i>
            Press Search to apply your changes.
          </p>
        )}

      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <AgGridTable
          rowData={assets}
          columnDefs={columnDefs}
          components={components}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onRowDoubleClicked={(event) =>
            navigate(`/dashboard/asset/detail/${encodeURIComponent(event.data.assetId)}`)
          }
          getRowId={(params) => params.data._id}
          pagination={true}
          paginationPageSize={10}
          overlayNoRowsTemplate="<span>No Assets Found</span>"
          style={{ height: 600 }}
          className="rounded-2xl"
          gridOptions={{
            animateRows: true,
            rowHeight: 55,
            headerHeight: 55,
            /* No floatingFilter row — the search bar above is the one place to
               filter, and a second always-on filter strip only duplicated it.
               Per-column filters are still reachable from the header menu. */
            defaultColDef: {
              sortable: true,
              filter: true,
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

export default ViewAssets;
