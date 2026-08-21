import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import HeadingBox from '../../components/dashboard/HeadingBox';
import AssetStatusGraph from '../../components/dashboard/AssetStatusGraph';
import AssetCategoryGraph from '../../components/dashboard/AssetCategoryGraph';
import { getAssetOverview, getWarrantyExpiring } from '../../redux/actions/assetAction';
import { conditionColor, formatDate, statusColor } from './assetHelpers';

const WINDOW_OPTIONS = [30, 60, 90];

const AssetDashboard = () => {
  const dispatch = useDispatch();

  const [overview, setOverview] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    availableAssets: 0,
    underMaintenanceAssets: 0,
  });

  const [days, setDays] = useState(30);
  const [expiring, setExpiring] = useState([]);

  useEffect(() => {
    const getOverview = async () => {
      try {
        const res = await dispatch(getAssetOverview());
        if (res?.status === 'success') {
          setOverview(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOverview();
  }, [dispatch]);

  const fetchExpiring = useCallback(async () => {
    try {
      const res = await dispatch(getWarrantyExpiring(days));
      if (res?.status === 'success') {
        setExpiring(res.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, days]);

  useEffect(() => {
    fetchExpiring();
  }, [fetchExpiring]);

  return (
    <div className="bg-gray-100 min-h-screen p-4 w-full">

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Asset Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Company equipment at a glance
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/dashboard/asset/view"
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              <i className="fas fa-list mr-2"></i>
              All Assets
            </Link>

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

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">

        <HeadingBox
          title="Total Assets"
          count={overview.totalAssets}
          icon="fas fa-boxes-stacked"
          color="from-blue-500 to-cyan-500"
          link="/dashboard/asset/view"
        />

        <HeadingBox
          title="Assigned"
          count={overview.assignedAssets}
          icon="fas fa-user-check"
          color="from-indigo-500 to-blue-500"
          link="/dashboard/asset/view"
        />

        <HeadingBox
          title="Available"
          count={overview.availableAssets}
          icon="fas fa-warehouse"
          color="from-green-500 to-emerald-500"
          link="/dashboard/asset/view"
        />

        <HeadingBox
          title="Under Maintenance"
          count={overview.underMaintenanceAssets}
          icon="fas fa-screwdriver-wrench"
          color="from-orange-500 to-amber-500"
          link="/dashboard/asset/view"
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AssetStatusGraph />
        <AssetCategoryGraph />
      </div>

      {/* Warranty expiring */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-3">

          <div>
            <h2 className="text-base font-bold text-gray-800">
              Warranty Expiring
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Assets whose warranty ends within the selected window
            </p>
          </div>

          <div className="flex gap-2">
            {WINDOW_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setDays(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${days === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {option} days
              </button>
            ))}
          </div>

        </div>

        {expiring.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-3 pr-4">Asset ID</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Brand / Model</th>
                  <th className="py-3 pr-4">Warranty Expiry</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Condition</th>
                  <th className="py-3 pr-4">Assigned To</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>

              <tbody>
                {expiring.map((asset) => (
                  <tr key={asset._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-800">
                      {asset.assetId}
                    </td>

                    <td className="py-3 pr-4">{asset.category}</td>

                    <td className="py-3 pr-4">
                      {asset.brand} {asset.modelName}
                    </td>

                    <td className="py-3 pr-4 text-amber-700 font-medium">
                      {formatDate(asset.warrantyExpiryDate)}
                    </td>

                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>

                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${conditionColor(asset.condition)}`}>
                        {asset.condition}
                      </span>
                    </td>

                    <td className="py-3 pr-4">
                      {asset.currentAssignee?.empId
                        ? `${asset.currentAssignee.empName} (${asset.currentAssignee.empId})`
                        : '-'}
                    </td>

                    <td className="py-3 pr-4">
                      <Link
                        to={`/dashboard/asset/detail/${encodeURIComponent(asset.assetId)}`}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            No warranties expiring in the next {days} days.
          </p>
        )}

      </div>

    </div>
  );
};

export default AssetDashboard;
