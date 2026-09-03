import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import AgGridTable from '../../components/common/AgGridTable';
import { AssignAssetPopup } from '../../components/popup';
import { assignAsset, getAssetCategories, getAssets } from '../../redux/actions/assetAction';
import { conditionColor, formatDate, getLoggedInEmail, statusColor } from './assetHelpers';
import { IMPORT_COLUMNS, isoDate, blankIfMissing } from './assetImportFormat';
import { exportToExcel } from '../../utils/utils';

const EMPTY_FILTERS = { category: '', status: '', condition: '' };

const ViewAssets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assets = [], refresh, enums } = useSelector((state) => state.assets);

  /* The whole asset list is already in memory (the API returns every row; the grid paginates
     client-side), so the search box filters locally across EVERY column instead of calling the
     server's /search — which only looked at assetId, serial, brand, model and notes. Typing is
     now live and matches category, status, condition, assignee, location and warranty too. */
  const [quickFilter, setQuickFilter] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [gridApi, setGridApi] = useState(null);

  /* Assigning straight from the row means HR never has to open the detail page just to
     hand an asset over — the single most repeated action on this screen. */
  const [assigningAsset, setAssigningAsset] = useState(null);

  useEffect(() => {
    dispatch(getAssetCategories());
  }, [dispatch]);

  /* Dropdowns stay server-side — they narrow which rows are fetched at all. The search box
     then filters within whatever came back, so the two compose instead of excluding each other. */
  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value)
    );
    dispatch(getAssets(activeFilters));
  }, [dispatch, filters, refresh]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setQuickFilter('');
  };

  const handleAssign = async (formData) => {
    try {
      const res = await dispatch(
        assignAsset({
          assetId: assigningAsset.assetId,
          empId: formData.empId,
          conditionAtAssign: formData.conditionAtAssign,
          remarks: formData.remarks,
          componentChecksAtAssign: formData.componentChecksAtAssign,
          courierName: formData.courierName || undefined,
          trackingNumber: formData.trackingNumber || undefined,
          shippedToAddress: formData.shippedToAddress || undefined,
          assignedBy: getLoggedInEmail(),
        })
      );

      if (res?.code === 200) {
        const assignee = res?.data?.currentAssignee;
        toast(
          assignee?.empName
            ? `${assigningAsset.assetId} assigned to ${assignee.empName}`
            : 'Asset Assigned Successfully'
        );
        setAssigningAsset(null);
        /* assignAsset already dispatches SET_REFRESH_ASSET, so the grid reloads itself. */
      } else {
        toast(res?.message || 'Unable to assign asset');
      }
    } catch (error) {
      console.log(error);
      toast('Something went wrong');
    }
  };

  /* Exports exactly the rows on screen. Pulling them back out of the grid (rather than from
     `assets`) is what makes the search box count too — otherwise a filtered view would still
     export all 207. Falls back to the full list before the grid has registered. */
  const handleExport = () => {
    let visible = assets;

    if (gridApi) {
      const filtered = [];
      gridApi.forEachNodeAfterFilterAndSort((node) => {
        if (node.data) filtered.push(node.data);
      });
      visible = filtered;
    }

    /* Column names and value formats deliberately match the import template, so an exported
       sheet can be edited and imported straight back. Two rules make that work:
       dates go out as YYYY-MM-DD (a locale date like 15/01/2026 cannot be parsed back), and
       missing values go out blank rather than '-' (which would otherwise be stored as the
       literal vendor/serial text, and serial numbers must be unique).
       Asset ID / Category / Status / Assigned To Name / Assigned Since are for reading only —
       the importer knows those headers and ignores them. */
    const componentStatus = (asset, name) =>
      (asset.componentChecks || []).find((c) => c.component === name)?.status || '';

    const rows = visible.map((asset) => {
      const row = {
        'Asset ID': asset.assetId,
        'Category': asset.category,
        'Status': asset.status,
        'Assigned To Name': asset.currentAssignee?.empName || '',
        'Assigned Since': isoDate(asset.currentAssignee?.assignedDate),
      };

      IMPORT_COLUMNS.forEach((col) => {
        if (col.component) {
          row[col.header] = componentStatus(asset, col.header);
          return;
        }

        switch (col.key) {
          case 'brand': row[col.header] = asset.brand; break;
          case 'modelName': row[col.header] = asset.modelName; break;
          case 'serialNumber': row[col.header] = blankIfMissing(asset.serialNumber); break;
          case 'purchaseDate': row[col.header] = isoDate(asset.purchaseDate); break;
          case 'purchaseCost': row[col.header] = blankIfMissing(asset.purchaseCost); break;
          case 'vendor': row[col.header] = blankIfMissing(asset.vendor); break;
          case 'warrantyExpiryDate': row[col.header] = isoDate(asset.warrantyExpiryDate); break;
          case 'condition': row[col.header] = blankIfMissing(asset.condition); break;
          case 'locationType': row[col.header] = blankIfMissing(asset.locationType); break;
          case 'currentLocation': row[col.header] = blankIfMissing(asset.currentLocation); break;
          case 'assignedToEmpId': row[col.header] = asset.currentAssignee?.empId || ''; break;
          case 'specifications': row[col.header] = blankIfMissing(asset.specifications); break;
          case 'notes': row[col.header] = blankIfMissing(asset.notes); break;
          default: row[col.header] = '';
        }
      });

      return row;
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    exportToExcel(rows, `assets-export-${timestamp}`);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

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

  /* Only `Available` assets can be assigned — the backend rejects anything else, so the
     button is hidden rather than shown and then failing. setState identity is stable, so
     the empty dep array is safe. */
  const ActionCellRenderer = useCallback((props) => (
    <div className="flex items-center gap-2">
      <Link
        to={`/dashboard/asset/detail/${encodeURIComponent(props.data.assetId)}`}
        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
      >
        View
      </Link>

      {props.data.status === 'Available' && (
        <button
          onClick={() => setAssigningAsset(props.data)}
          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition whitespace-nowrap"
        >
          <i className="fas fa-user-check mr-1"></i>
          Assign
        </button>
      )}
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
      minWidth: 200,
      pinned: 'right',
    },
  ], []);

  const components = useMemo(() => ({
    statusCellRenderer: StatusCellRenderer,
    conditionCellRenderer: ConditionCellRenderer,
    actionCellRenderer: ActionCellRenderer,
  }), [StatusCellRenderer, ConditionCellRenderer, ActionCellRenderer]);

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Assets
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Track company equipment, assignments and condition
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
              <p className="text-xs text-blue-600">
                Total Assets
              </p>

              <h3 className="text-lg font-bold text-blue-700">
                {assets.length}
              </h3>
            </div>

            <button
              onClick={handleExport}
              disabled={!assets.length}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-file-export mr-2"></i>
              Export
            </button>

            <Link
              to="/dashboard/asset/add"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Asset
            </Link>

          </div>

        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">

        <div className="flex flex-col md:flex-row gap-3 md:items-center">

          <div className="relative w-full">
            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

            <input
              type="text"
              name="search"
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
              placeholder="Search anything — ID, serial, brand, model, status, condition, employee, location"
              className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 pl-11 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />

            {quickFilter && (
              <button
                onClick={() => setQuickFilter('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-circle-xmark"></i>
              </button>
            )}
          </div>

          <div className="flex gap-2 shrink-0">

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`px-4 py-2.5 rounded-lg text-sm border transition whitespace-nowrap ${activeFilterCount
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <i className="fas fa-sliders mr-2"></i>
              Filters
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition whitespace-nowrap"
            >
              <i className="fas fa-rotate-left mr-2"></i>
              Reset
            </button>

          </div>

        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200">

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
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
                value={filters.status}
                onChange={handleFilterChange}
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
                value={filters.condition}
                onChange={handleFilterChange}
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

          </div>
        )}

        {quickFilter && (
          <p className="text-xs text-slate-500 mt-3">
            <i className="fas fa-circle-info mr-2"></i>
            Showing matches for “{quickFilter}” across all columns.
          </p>
        )}

      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <AgGridTable
          rowData={assets}
          columnDefs={columnDefs}
          components={components}
          quickFilterText={quickFilter}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.sizeColumnsToFit();
          }}
          onRowDoubleClicked={(event) =>
            navigate(`/dashboard/asset/detail/${encodeURIComponent(event.data.assetId)}`)
          }
          getRowId={(params) => params.data._id}
          pagination={true}
          paginationPageSize={10}
          overlayNoRowsTemplate="<span>No Assets Found</span>"
          style={{ height: 460 }}
          className="rounded-xl ag-centered"
          gridOptions={{
            animateRows: true,
            rowHeight: 55,
            headerHeight: 55,
            /* floatingFilter must be set false explicitly: AgGridTable's own defaultColDef
               turns it on, and this object is merged over that — omitting the key left the
               per-column filter strip showing despite the search bar duplicating it.
               Per-column filters are still reachable from each header's menu. */
            defaultColDef: {
              sortable: true,
              filter: true,
              floatingFilter: false,
              resizable: true,
              flex: 1,
              minWidth: 120,
            },
          }}
        />

      </div>

      {assigningAsset && (
        <AssignAssetPopup
          asset={assigningAsset}
          onClose={() => setAssigningAsset(null)}
          onSubmit={handleAssign}
        />
      )}

    </div>
  );
};

export default ViewAssets;
