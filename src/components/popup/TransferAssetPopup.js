import React, { useState } from "react";
import { useSelector } from "react-redux";
import { validateTransfer } from "../../pages/asset/validate";
import ComponentChecklist, {
  defaultComponentChecks,
  sanitizeComponentChecks,
} from "../common/ComponentChecklist";
import EmployeeSelect from "../common/EmployeeSelect";

function TransferAssetPopup({ asset, onClose, onSubmit }) {
  const { enums } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    newEmpId: "",
    conditionAtReturn: "",
    conditionAtAssign: "",
    remarks: "",
    courierName: "",
    trackingNumber: "",
    shippedToAddress: "",
  });
  const [errors, setErrors] = useState({});

  /* A transfer is a return and an assign in one call, so it carries both checklists */
  const activeAssignment = asset?.assignmentHistory?.find(
    (record) => record.status === "Active"
  );

  const [checksAtReturn, setChecksAtReturn] = useState(
    activeAssignment?.componentChecksAtAssign?.length
      ? activeAssignment.componentChecksAtAssign.map((check) => ({
        component: check.component,
        status: "",
      }))
      : defaultComponentChecks(asset?.category)
  );

  const [checksAtAssign, setChecksAtAssign] = useState(
    defaultComponentChecks(asset?.category)
  );

  /* Collapsed by default — in-office handovers never touch these */
  const [showShipping, setShowShipping] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newErrors = validateTransfer(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      componentChecksAtReturn: sanitizeComponentChecks(checksAtReturn),
      componentChecksAtAssign: sanitizeComponentChecks(checksAtAssign),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Transfer Asset</h3>
            <p className="text-purple-100 text-sm mt-1">
              {asset?.assetId} — from {asset?.currentAssignee?.empName} ({asset?.currentAssignee?.empId})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">

          {/* The current holder cannot be the transfer target */}
          <EmployeeSelect
            label="Transfer To"
            value={formData.newEmpId}
            onChange={(newEmpId) => {
              setErrors((prev) => ({ ...prev, newEmpId: "" }));
              setFormData((prev) => ({ ...prev, newEmpId }));
            }}
            error={errors.newEmpId}
            excludeEmpId={asset?.currentAssignee?.empId}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="conditionAtReturn">
                Condition At Return <span className="text-red-500">*</span>
              </label>

              <select
                name="conditionAtReturn"
                value={formData.conditionAtReturn}
                onChange={handleChange}
                className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.conditionAtReturn ? "border-red-500" : ""
                  }`}
              >
                <option value="" disabled hidden>
                  Select Condition
                </option>

                {enums.CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              {errors.conditionAtReturn && (
                <p className="text-red-500 text-xs italic my-2">{errors.conditionAtReturn}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="conditionAtAssign">
                Condition At Assign <span className="text-red-500">*</span>
              </label>

              <select
                name="conditionAtAssign"
                value={formData.conditionAtAssign}
                onChange={handleChange}
                className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.conditionAtAssign ? "border-red-500" : ""
                  }`}
              >
                <option value="" disabled hidden>
                  Select Condition
                </option>

                {enums.CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              {errors.conditionAtAssign && (
                <p className="text-red-500 text-xs italic my-2">{errors.conditionAtAssign}</p>
              )}
            </div>

          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Reason for transfer"
              className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <ComponentChecklist
            label={`Component Checks At Return (from ${asset?.currentAssignee?.empName || "current holder"})`}
            description="What was verified when the asset came back from the current holder."
            value={checksAtReturn}
            onChange={setChecksAtReturn}
            category={asset?.category}
          />

          <ComponentChecklist
            label="Component Checks At Assign (to new holder)"
            description="What is being handed over to the new holder."
            value={checksAtAssign}
            onChange={setChecksAtAssign}
            category={asset?.category}
          />

          {/* Shipping details */}
          <div className="border-t pt-4">

            <button
              type="button"
              onClick={() => setShowShipping((prev) => !prev)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-gray-700 text-sm font-bold">
                Shipping details
                <span className="text-slate-400 font-normal ml-2">(optional)</span>
              </span>

              <i className={`fas fa-chevron-${showShipping ? "up" : "down"} text-xs text-slate-500`}></i>
            </button>

            {showShipping && (
              <div className="mt-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courierName">
                      Courier Name
                    </label>

                    <input
                      type="text"
                      name="courierName"
                      value={formData.courierName}
                      onChange={handleChange}
                      placeholder="e.g. Blue Dart"
                      className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trackingNumber">
                      Tracking Number
                    </label>

                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleChange}
                      placeholder="Consignment number"
                      className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippedToAddress">
                    Shipped To Address
                  </label>

                  <textarea
                    name="shippedToAddress"
                    rows={3}
                    value={formData.shippedToAddress}
                    onChange={handleChange}
                    placeholder="New holder's delivery address"
                    className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
          >
            <i className="fas fa-right-left mr-2"></i>
            Transfer
          </button>
        </div>

      </div>
    </div>
  );
}

export default TransferAssetPopup;
