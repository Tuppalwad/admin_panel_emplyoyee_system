import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  AssignAssetPopup,
  MaintenancePopup,
  ReturnAssetPopup,
  TransferAssetPopup,
} from '../../components/popup';
import { ComponentChecksTable } from '../../components/common';
import { mergeComponentChecks } from '../../components/common/ComponentChecklist';
import {
  addMaintenance,
  assignAsset,
  deleteAsset,
  getAssetById,
  markAssetDead,
  retireAsset,
  returnAsset,
  transferAsset,
  updateMaintenance,
} from '../../redux/actions/assetAction';
import {
  assetActionState,
  conditionColor,
  formatDate,
  getLoggedInEmail,
  isTerminalStatus,
  maintenanceStatusColor,
  returnSuccessMessage,
  statusColor,
} from './assetHelpers';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2 gap-4">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right break-words">{value || '-'}</span>
  </div>
);

const AssetDetail = () => {
  const { assetId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [deadRemarks, setDeadRemarks] = useState('');
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  const notify = (message) => toast(message);

  const fetchAsset = useCallback(async () => {
    const res = await dispatch(getAssetById(assetId));
    if (res?.code === 200) {
      setAsset(res.data);
    } else {
      setNotFound(true);
      notify(res?.message || 'Asset not found');
    }
  }, [dispatch, assetId]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  const closePopup = () => {
    setActivePopup(null);
    setSelectedMaintenance(null);
    setDeadRemarks('');
  };

  /* Every lifecycle call returns the same envelope, so success handling is shared.
     `successMessage` may be a function of the response when the wording depends on
     the resulting status. */
  const runAction = async (action, successMessage) => {
    try {
      const res = await action();

      if (res?.code === 200 || res?.code === 201) {
        notify(
          typeof successMessage === 'function' ? successMessage(res) : successMessage
        );
        closePopup();
        await fetchAsset();
        return true;
      }

      notify(res?.message || 'Action failed');
      return false;
    } catch (error) {
      console.log(error);
      notify('Something went wrong');
      return false;
    }
  };

  const handleAssign = (formData) =>
    runAction(
      () =>
        dispatch(
          assignAsset({
            assetId: asset.assetId,
            empId: formData.empId,
            conditionAtAssign: formData.conditionAtAssign,
            remarks: formData.remarks,
            componentChecksAtAssign: formData.componentChecksAtAssign,
            courierName: formData.courierName || undefined,
            trackingNumber: formData.trackingNumber || undefined,
            shippedToAddress: formData.shippedToAddress || undefined,
            assignedBy: getLoggedInEmail(),
          })
        ),
      'Asset Assigned Successfully'
    );

  const handleReturn = (formData) =>
    runAction(
      () =>
        dispatch(
          returnAsset({
            assetId: asset.assetId,
            conditionAtReturn: formData.conditionAtReturn,
            remarks: formData.remarks,
            componentChecksAtReturn: formData.componentChecksAtReturn,
          })
        ),
      (res) => returnSuccessMessage(res?.data)
    );

  const handleTransfer = (formData) =>
    runAction(
      () =>
        dispatch(
          transferAsset({
            assetId: asset.assetId,
            newEmpId: formData.newEmpId,
            conditionAtReturn: formData.conditionAtReturn,
            conditionAtAssign: formData.conditionAtAssign,
            remarks: formData.remarks,
            componentChecksAtReturn: formData.componentChecksAtReturn,
            componentChecksAtAssign: formData.componentChecksAtAssign,
            courierName: formData.courierName || undefined,
            trackingNumber: formData.trackingNumber || undefined,
            shippedToAddress: formData.shippedToAddress || undefined,
            assignedBy: getLoggedInEmail(),
          })
        ),
      'Asset Transferred Successfully'
    );

  const handleAddMaintenance = (formData) =>
    runAction(
      () =>
        dispatch(
          addMaintenance({
            assetId: asset.assetId,
            issueReported: formData.issueReported,
            vendor: formData.vendor,
            componentChecks: formData.componentChecks,
          })
        ),
      'Maintenance Issue Logged'
    );

  const handleUpdateMaintenance = (formData) =>
    runAction(
      () =>
        dispatch(
          updateMaintenance({
            assetId: asset.assetId,
            maintenanceId: selectedMaintenance._id,
            status: formData.status,
            cost: formData.cost === '' ? undefined : Number(formData.cost),
            remarks: formData.remarks,
            componentChecks: formData.componentChecks,
          })
        ),
      'Maintenance Updated'
    );

  const handleRetire = async () => {
    if (!window.confirm('Retire this asset? Retired assets become read-only.')) return;
    await runAction(() => dispatch(retireAsset(asset.assetId)), 'Asset Retired');
  };

  const handleMarkDead = async () => {
    await runAction(
      () =>
        dispatch(
          markAssetDead({
            assetId: asset.assetId,
            remarks: deadRemarks || undefined,
          })
        ),
      'Asset Marked Dead'
    );
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this asset permanently? This cannot be undone.')) return;

    const res = await dispatch(deleteAsset(asset.assetId));
    if (res?.code === 200) {
      notify('Asset Deleted');
      navigate('/dashboard/asset/view');
    } else {
      notify(res?.message || 'Unable to delete asset');
    }
  };

  if (notFound) {
    return <p className="text-center text-gray-500 p-6">Asset details not available</p>;
  }

  if (!asset) {
    return <p className="text-center text-gray-500 p-6">Loading asset...</p>;
  }

  const actions = assetActionState(asset);
  const terminal = isTerminalStatus(asset.status);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div>
              <button
                onClick={() => navigate('/dashboard/asset/view')}
                className="text-sm text-blue-600 hover:text-blue-800 mb-1"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Assets
              </button>

              <h1 className="text-xl font-bold text-gray-800">
                {asset.assetId}
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                {asset.category} — {asset.brand} {asset.modelName}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">

              {actions.canEdit && (
                <button
                  onClick={() =>
                    navigate('/dashboard/asset/add', { state: { info: asset } })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  <i className="fas fa-pen mr-2"></i>
                  Edit
                </button>
              )}

              {actions.canAssign && (
                <button
                  onClick={() => setActivePopup('assign')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  <i className="fas fa-user-check mr-2"></i>
                  Assign
                </button>
              )}

              {actions.canReturn && (
                <button
                  onClick={() => setActivePopup('return')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"
                >
                  <i className="fas fa-rotate-left mr-2"></i>
                  Return
                </button>
              )}

              {actions.canTransfer && (
                <button
                  onClick={() => setActivePopup('transfer')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                >
                  <i className="fas fa-right-left mr-2"></i>
                  Transfer
                </button>
              )}

              {actions.canAddMaintenance && (
                <button
                  onClick={() => setActivePopup('maintenance')}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
                >
                  <i className="fas fa-screwdriver-wrench mr-2"></i>
                  Log Issue
                </button>
              )}

              {actions.canRetire && (
                <button
                  onClick={handleRetire}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 transition"
                >
                  <i className="fas fa-box-archive mr-2"></i>
                  Retire
                </button>
              )}

              {actions.canMarkDead && (
                <button
                  onClick={() => setActivePopup('markdead')}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm hover:bg-red-800 transition"
                >
                  <i className="fas fa-skull mr-2"></i>
                  Mark as Dead
                </button>
              )}

              {actions.canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              )}

            </div>

          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(asset.status)}`}>
              {asset.status}
            </span>

            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${conditionColor(asset.condition)}`}>
              {asset.condition}
            </span>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {asset.locationType}
            </span>
          </div>

          {terminal && (
            <div className="mt-3 bg-slate-100 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-700">
                <i className="fas fa-lock mr-2"></i>
                This asset is <strong>{asset.status}</strong> — it is read-only and cannot
                be assigned or modified.
              </p>
            </div>
          )}

          {asset.status === 'Dead' && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <i className="fas fa-skull mr-2"></i>
                Marked <strong>Dead</strong> — broken beyond use, but not formally
                written off yet. It can still be retired.
              </p>
            </div>
          )}

          {!terminal && asset.status === 'Assigned' && !actions.canRetire && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <i className="fas fa-circle-info mr-2"></i>
                Currently assigned — it must be returned before it can be retired or sent
                for maintenance.
              </p>
            </div>
          )}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Asset Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Asset Information
            </h2>

            <div className="space-y-2.5">
              <InfoRow label="Category" value={asset.category} />
              <InfoRow label="Brand" value={asset.brand} />
              <InfoRow label="Model" value={asset.modelName} />
              <InfoRow label="Serial Number" value={asset.serialNumber} />
              <InfoRow label="Specifications" value={asset.specifications} />
              <InfoRow label="Current Location" value={asset.currentLocation} />
              <InfoRow label="Notes" value={asset.notes} />
            </div>
          </div>

          {/* Purchase & Warranty */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Purchase & Warranty
            </h2>

            <div className="space-y-2.5">
              <InfoRow label="Purchase Date" value={formatDate(asset.purchaseDate)} />

              <InfoRow
                label="Purchase Cost"
                value={
                  asset.purchaseCost || asset.purchaseCost === 0
                    ? `₹ ${Number(asset.purchaseCost).toLocaleString()}`
                    : '-'
                }
              />

              <InfoRow label="Vendor" value={asset.vendor} />
              <InfoRow label="Warranty Expiry" value={formatDate(asset.warrantyExpiryDate)} />
              <InfoRow label="Added On" value={formatDate(asset.createdAt)} />
              <InfoRow label="Last Updated" value={formatDate(asset.updatedAt)} />
            </div>
          </div>

          {/* Current Assignment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Current Assignment
            </h2>

            {asset.currentAssignee?.empId ? (
              <div className="space-y-2.5">
                <InfoRow label="Employee" value={asset.currentAssignee.empName} />
                <InfoRow label="Employee ID" value={asset.currentAssignee.empId} />
                <InfoRow
                  label="Assigned Date"
                  value={formatDate(asset.currentAssignee.assignedDate)}
                />

                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/asset/employee?empId=${encodeURIComponent(
                        asset.currentAssignee.empId
                      )}`
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all assets held by this employee
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                This asset is not assigned to anyone.
              </p>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Documents
            </h2>

            {asset.documents?.length ? (
              <div className="space-y-2">
                {asset.documents.map((doc, index) => (
                  <a
                    key={doc._id || index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 transition"
                  >
                    <p className="font-medium text-blue-600">{doc.name}</p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Uploaded on {formatDate(doc.uploadedAt)}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents attached.</p>
            )}
          </div>

        </div>

        {/* Component Checks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Component Checks
          </h2>

          <p className="text-sm text-gray-500 mb-3">
            Most recently recorded per-component state. Update it from the edit form
            or from any assign, return, transfer or maintenance action.
          </p>

          <ComponentChecksTable checks={asset.componentChecks} />
        </div>

        {/* Assignment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Assignment History
          </h2>

          <p className="text-sm text-gray-500 mb-3">
            Expand a row to see its component checks and shipping details.
          </p>

          {asset.assignmentHistory?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-3 pr-4">Employee</th>
                    <th className="py-3 pr-4">Assigned</th>
                    <th className="py-3 pr-4">Returned</th>
                    <th className="py-3 pr-4">Condition Out</th>
                    <th className="py-3 pr-4">Condition In</th>
                    <th className="py-3 pr-4">Assigned By</th>
                    <th className="py-3 pr-4">Remarks</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {asset.assignmentHistory.map((record) => (
                    <React.Fragment key={record._id}>
                    <tr className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {record.empName}
                        <span className="block text-xs text-slate-500">
                          {record.empId}
                        </span>
                      </td>

                      <td className="py-3 pr-4">{formatDate(record.assignedDate)}</td>
                      <td className="py-3 pr-4">{formatDate(record.returnDate)}</td>

                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${conditionColor(record.conditionAtAssign)}`}>
                          {record.conditionAtAssign}
                        </span>
                      </td>

                      <td className="py-3 pr-4">
                        {record.conditionAtReturn ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${conditionColor(record.conditionAtReturn)}`}>
                            {record.conditionAtReturn}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">{record.assignedBy || '-'}</td>
                      <td className="py-3 pr-4 text-slate-600">{record.remarks || '-'}</td>

                      <td className="py-3 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${record.status === 'Active'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      <td className="py-3 pr-4">
                        <button
                          onClick={() =>
                            setExpandedAssignment(
                              expandedAssignment === record._id ? null : record._id
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                          title="Component checks and shipping"
                        >
                          <i className={`fas fa-chevron-${expandedAssignment === record._id ? 'up' : 'down'} text-xs`}></i>
                        </button>
                      </td>
                    </tr>

                    {expandedAssignment === record._id && (
                      <tr className="border-b last:border-0 bg-slate-50">
                        <td colSpan={9} className="p-4">

                          {/* Shipping */}
                          {record.courierName ? (
                            <div className="mb-5">
                              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                Shipping
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Courier</p>
                                  <p className="font-medium text-slate-800">{record.courierName}</p>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Tracking Number</p>
                                  <p className="font-medium text-slate-800">{record.trackingNumber || '-'}</p>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-3">
                                  <p className="text-xs text-slate-500 mb-1">Shipped To</p>
                                  <p className="font-medium text-slate-800 break-words">{record.shippedToAddress || '-'}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-500 mb-5">
                              Handed over in person — no shipping recorded.
                            </p>
                          )}

                          {/* Component checks out vs in */}
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                            Component Checks
                          </h4>

                          {mergeComponentChecks(
                            record.componentChecksAtAssign,
                            record.componentChecksAtReturn
                          ).length ? (
                            <table className="min-w-full text-sm bg-white border border-slate-200 rounded-xl overflow-hidden">
                              <thead>
                                <tr className="text-left text-slate-500 border-b">
                                  <th className="py-2 px-3">Component</th>
                                  <th className="py-2 px-3">At Assign</th>
                                  <th className="py-2 px-3">At Return</th>
                                </tr>
                              </thead>

                              <tbody>
                                {mergeComponentChecks(
                                  record.componentChecksAtAssign,
                                  record.componentChecksAtReturn
                                ).map((row) => (
                                  <tr
                                    key={row.component}
                                    className={`border-b last:border-0 ${row.changed ? 'bg-amber-50' : ''}`}
                                  >
                                    <td className="py-2 px-3 font-medium text-slate-800">
                                      {row.component}
                                    </td>

                                    <td className="py-2 px-3 text-slate-600">
                                      {row.statusAtAssign || '-'}
                                    </td>

                                    <td className="py-2 px-3 text-slate-600">
                                      {row.statusAtReturn || '-'}
                                      {row.changed && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                          changed
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-slate-500">
                              No component checks recorded for this assignment.
                            </p>
                          )}

                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">This asset has never been assigned.</p>
          )}
        </div>

        {/* Maintenance History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Maintenance History
          </h2>

          {asset.maintenanceHistory?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="py-3 pr-4">Issue</th>
                    <th className="py-3 pr-4">Reported</th>
                    <th className="py-3 pr-4">Resolved</th>
                    <th className="py-3 pr-4">Vendor</th>
                    <th className="py-3 pr-4">Cost</th>
                    <th className="py-3 pr-4">Remarks</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {asset.maintenanceHistory.map((record) => (
                    <tr key={record._id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-800">
                        {record.issueReported}
                      </td>

                      <td className="py-3 pr-4">{formatDate(record.reportedDate)}</td>
                      <td className="py-3 pr-4">{formatDate(record.resolvedDate)}</td>
                      <td className="py-3 pr-4">{record.vendor || '-'}</td>

                      <td className="py-3 pr-4">
                        {record.cost || record.cost === 0
                          ? `₹ ${Number(record.cost).toLocaleString()}`
                          : '-'}
                      </td>

                      <td className="py-3 pr-4 text-slate-600">{record.remarks || '-'}</td>

                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${maintenanceStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>

                      <td className="py-3 pr-4">
                        {record.status !== 'Resolved' && !terminal && (
                          <button
                            onClick={() => {
                              setSelectedMaintenance(record);
                              setActivePopup('maintenance-update');
                            }}
                            className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-200 transition"
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No maintenance recorded for this asset.</p>
          )}
        </div>

      </div>

      {activePopup === 'assign' && (
        <AssignAssetPopup asset={asset} onClose={closePopup} onSubmit={handleAssign} />
      )}

      {activePopup === 'return' && (
        <ReturnAssetPopup asset={asset} onClose={closePopup} onSubmit={handleReturn} />
      )}

      {activePopup === 'transfer' && (
        <TransferAssetPopup asset={asset} onClose={closePopup} onSubmit={handleTransfer} />
      )}

      {activePopup === 'maintenance' && (
        <MaintenancePopup asset={asset} onClose={closePopup} onSubmit={handleAddMaintenance} />
      )}

      {activePopup === 'markdead' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

            <div className="bg-gradient-to-r from-red-700 to-red-600 px-5 py-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-white">Mark as Dead</h3>

                <p className="text-red-100 text-sm mt-0.5">
                  {asset.assetId} — {asset.brand} {asset.modelName}
                </p>
              </div>

              <button
                onClick={closePopup}
                className="text-white/80 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-slate-700 mb-3">
                This sets the status to <strong>Dead</strong> and the condition to
                <strong> Beyond Repair</strong>. Use it for equipment that is broken
                beyond use but not yet formally written off — it can still be retired later.
              </p>

              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadRemarks">
                Remarks
                <span className="text-slate-400 font-normal ml-2">(optional)</span>
              </label>

              <textarea
                name="deadRemarks"
                rows={3}
                value={deadRemarks}
                onChange={(event) => setDeadRemarks(event.target.value)}
                placeholder="What failed, and when it was confirmed unusable"
                className="shadow appearance-none border-gray-300 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <p className="text-xs text-slate-500 mt-2">
                Remarks are appended to the asset's notes.
              </p>
            </div>

            <div className="border-t bg-white px-5 py-3 flex justify-end gap-2">
              <button
                onClick={closePopup}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleMarkDead}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm"
              >
                <i className="fas fa-skull mr-2"></i>
                Mark as Dead
              </button>
            </div>

          </div>
        </div>
      )}

      {activePopup === 'maintenance-update' && (
        <MaintenancePopup
          asset={asset}
          record={selectedMaintenance}
          onClose={closePopup}
          onSubmit={handleUpdateMaintenance}
        />
      )}

    </div>
  );
};

export default AssetDetail;
