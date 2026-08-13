import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ReturnAssetPopup } from '../../components/popup';
import { EmployeeSelect } from '../../components/common';
import {
  getAssetsByEmpId,
  getEmployeeAssetHistory,
  returnAsset,
} from '../../redux/actions/assetAction';
import { conditionColor, formatDate, returnSuccessMessage, statusColor } from './assetHelpers';

const EmployeeAssets = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { allEmployees = [] } = useSelector((state) => state.employee) || {};

  const empId = searchParams.get('empId') || '';
  const [currentAssets, setCurrentAssets] = useState([]);
  const [history, setHistory] = useState([]);
  const [returningAsset, setReturningAsset] = useState(null);

  const notify = (message) => toast(message);

  const fetchAssets = useCallback(async () => {
    if (!empId) {
      setCurrentAssets([]);
      setHistory([]);
      return;
    }

    const [currentRes, historyRes] = await Promise.all([
      dispatch(getAssetsByEmpId(empId)),
      dispatch(getEmployeeAssetHistory(empId)),
    ]);

    setCurrentAssets(currentRes?.code === 200 ? currentRes.data || [] : []);
    setHistory(historyRes?.code === 200 ? historyRes.data || [] : []);
  }, [dispatch, empId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleEmployeeChange = (value) => {
    setSearchParams(value ? { empId: value } : {});
  };

  const handleReturn = async (formData) => {
    try {
      const res = await dispatch(
        returnAsset({
          assetId: returningAsset.assetId,
          conditionAtReturn: formData.conditionAtReturn,
          remarks: formData.remarks,
          componentChecksAtReturn: formData.componentChecksAtReturn,
        })
      );

      if (res?.code === 200) {
        notify(returnSuccessMessage(res?.data));
        setReturningAsset(null);
        await fetchAssets();
      } else {
        notify(res?.message || 'Unable to return asset');
      }
    } catch (error) {
      console.log(error);
      notify('Something went wrong');
    }
  };

  const selectedEmployee = allEmployees.find((employee) => employee.empId === empId);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Employee Assets
            </h1>

            <p className="text-slate-500 mt-1">
              What an employee is holding right now, and everything they have ever held
            </p>
          </div>

          <div className="w-full lg:w-96">
            <EmployeeSelect
              label="Employee"
              value={empId}
              onChange={handleEmployeeChange}
              isClearable
            />
          </div>

        </div>

      </div>

      {!empId ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <p className="text-slate-500">
            Select an employee to see their assets.
          </p>
        </div>
      ) : (
        <>
          {/* Currently held — the offboarding checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Currently Assigned
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedEmployee
                    ? `${selectedEmployee.fullName || selectedEmployee.firstName || ''} (${empId})`
                    : empId}
                  {' '}must return these before the account can be closed
                </p>
              </div>

              <div
                className={`px-5 py-3 rounded-xl border ${currentAssets.length
                  ? 'bg-orange-50 border-orange-100'
                  : 'bg-green-50 border-green-100'
                  }`}
              >
                <p className={`text-xs ${currentAssets.length ? 'text-orange-600' : 'text-green-600'}`}>
                  To Reclaim
                </p>

                <h3 className={`text-xl font-bold ${currentAssets.length ? 'text-orange-700' : 'text-green-700'}`}>
                  {currentAssets.length}
                </h3>
              </div>
            </div>

            {currentAssets.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-3 pr-4">Asset ID</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Brand / Model</th>
                      <th className="py-3 pr-4">Serial Number</th>
                      <th className="py-3 pr-4">Assigned Date</th>
                      <th className="py-3 pr-4">Condition</th>
                      <th className="py-3 pr-4"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentAssets.map((asset) => (
                      <tr key={asset._id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium text-slate-800">
                          {asset.assetId}
                        </td>

                        <td className="py-3 pr-4">{asset.category}</td>

                        <td className="py-3 pr-4">
                          {asset.brand} {asset.modelName}
                        </td>

                        <td className="py-3 pr-4">{asset.serialNumber || '-'}</td>

                        <td className="py-3 pr-4">
                          {formatDate(asset.currentAssignee?.assignedDate)}
                        </td>

                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${conditionColor(asset.condition)}`}>
                            {asset.condition}
                          </span>
                        </td>

                        <td className="py-3 pr-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setReturningAsset(asset)}
                              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition"
                            >
                              Return
                            </button>

                            <Link
                              to={`/dashboard/asset/detail/${encodeURIComponent(asset.assetId)}`}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">
                Nothing to reclaim — this employee holds no assets.
              </p>
            )}

          </div>

          {/* Full history */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Asset History
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Every asset this employee has ever held
            </p>

            {history.length ? (
              <div className="space-y-5">
                {history.map((asset) => {
                  const records = (asset.assignmentHistory || []).filter(
                    (record) => record.empId === empId
                  );

                  return (
                    <div
                      key={asset._id}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                        <div>
                          <Link
                            to={`/dashboard/asset/detail/${encodeURIComponent(asset.assetId)}`}
                            className="font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {asset.assetId}
                          </Link>

                          <span className="text-slate-500 ml-2">
                            {asset.category} — {asset.brand} {asset.modelName}
                          </span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500 border-b">
                              <th className="py-2 pr-4">Assigned</th>
                              <th className="py-2 pr-4">Returned</th>
                              <th className="py-2 pr-4">Condition Out</th>
                              <th className="py-2 pr-4">Condition In</th>
                              <th className="py-2 pr-4">Assigned By</th>
                              <th className="py-2 pr-4">Remarks</th>
                              <th className="py-2 pr-4">Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {records.map((record) => (
                              <tr key={record._id} className="border-b last:border-0">
                                <td className="py-2 pr-4">{formatDate(record.assignedDate)}</td>
                                <td className="py-2 pr-4">{formatDate(record.returnDate)}</td>
                                <td className="py-2 pr-4">{record.conditionAtAssign}</td>
                                <td className="py-2 pr-4">{record.conditionAtReturn || '-'}</td>
                                <td className="py-2 pr-4 text-slate-600">{record.assignedBy || '-'}</td>
                                <td className="py-2 pr-4 text-slate-600">{record.remarks || '-'}</td>

                                <td className="py-2 pr-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${record.status === 'Active'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-slate-100 text-slate-700'
                                      }`}
                                  >
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                No asset history for this employee.
              </p>
            )}

          </div>
        </>
      )}

      {returningAsset && (
        <ReturnAssetPopup
          asset={returningAsset}
          onClose={() => setReturningAsset(null)}
          onSubmit={handleReturn}
        />
      )}

    </div>
  );
};

export default EmployeeAssets;
