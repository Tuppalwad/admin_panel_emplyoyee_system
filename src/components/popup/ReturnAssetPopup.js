import React, { useState } from "react";
import { useSelector } from "react-redux";
import { validateReturn } from "../../pages/asset/validate";
import ComponentChecklist, {
  defaultComponentChecks,
  sanitizeComponentChecks,
} from "../common/ComponentChecklist";

/* Returning with "Damaged" or "Beyond Repair" sends the asset to UnderMaintenance
   instead of Available — the warning below mirrors that backend behaviour. */
const MAINTENANCE_CONDITIONS = ["Damaged", "Beyond Repair"];

function ReturnAssetPopup({ asset, onClose, onSubmit }) {
  const { enums } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    conditionAtReturn: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});

  /* Ask for the same components that were checked on the way out, so the audit
     view can compare like with like. Statuses start blank — they are re-checked. */
  const activeAssignment = asset?.assignmentHistory?.find(
    (record) => record.status === "Active"
  );

  const [componentChecks, setComponentChecks] = useState(
    activeAssignment?.componentChecksAtAssign?.length
      ? activeAssignment.componentChecksAtAssign.map((check) => ({
        component: check.component,
        status: "",
      }))
      : defaultComponentChecks(asset?.category)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newErrors = validateReturn(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      componentChecksAtReturn: sanitizeComponentChecks(componentChecks),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Return Asset</h3>
            <p className="text-emerald-100 text-sm mt-1">
              {asset?.assetId} — currently with {asset?.currentAssignee?.empName} ({asset?.currentAssignee?.empId})
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

          {MAINTENANCE_CONDITIONS.includes(formData.conditionAtReturn) && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-triangle-exclamation mr-2"></i>
                This asset will move to <strong>Under Maintenance</strong> instead of
                becoming available.
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any damage, missing accessories, etc."
              className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <ComponentChecklist
            label="Component Checks At Return"
            description="What was verified when the asset came back."
            value={componentChecks}
            onChange={setComponentChecks}
            category={asset?.category}
          />

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
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          >
            <i className="fas fa-rotate-left mr-2"></i>
            Return
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReturnAssetPopup;
