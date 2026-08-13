import React, { useState } from "react";
import { validateMaintenance } from "../../pages/asset/validate";
import ComponentChecklist, {
  defaultComponentChecks,
  sanitizeComponentChecks,
} from "../common/ComponentChecklist";

const MAINTENANCE_STATUS = ["Pending", "InProgress", "Resolved"];

/* One popup for both halves of the maintenance flow: pass `record` to update an
   existing entry, omit it to log a new issue. */
function MaintenancePopup({ asset, record, onClose, onSubmit }) {
  const isUpdate = Boolean(record);

  const [formData, setFormData] = useState({
    issueReported: record?.issueReported || "",
    vendor: record?.vendor || "",
    status: record?.status || "Pending",
    cost: record?.cost ?? "",
    remarks: record?.remarks || "",
  });
  const [errors, setErrors] = useState({});

  const [componentChecks, setComponentChecks] = useState(
    record?.componentChecks?.map((check) => ({
      component: check.component,
      status: check.status,
    })) || defaultComponentChecks(asset?.category)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!isUpdate) {
      const newErrors = validateMaintenance(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    onSubmit({
      ...formData,
      componentChecks: sanitizeComponentChecks(componentChecks),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isUpdate ? "Update Maintenance" : "Log Maintenance Issue"}
            </h3>

            <p className="text-amber-50 text-sm mt-1">
              {asset?.assetId} — {asset?.brand} {asset?.modelName}
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="issueReported">
              Issue Reported {!isUpdate && <span className="text-red-500">*</span>}
            </label>

            <textarea
              name="issueReported"
              rows={3}
              disabled={isUpdate}
              value={formData.issueReported}
              onChange={handleChange}
              placeholder="Describe the fault"
              className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-slate-100 ${errors.issueReported ? "border-red-500" : ""
                }`}
            />

            {errors.issueReported && (
              <p className="text-red-500 text-xs italic my-2">{errors.issueReported}</p>
            )}
          </div>

          <ComponentChecklist
            label="Component Checks"
            description={
              isUpdate
                ? "Condition of each component after this repair."
                : "Condition of each component as the fault was logged."
            }
            value={componentChecks}
            onChange={setComponentChecks}
            category={asset?.category}
          />

          {!isUpdate && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vendor">
                  Vendor
                </label>

                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  placeholder="Service vendor"
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <i className="fas fa-triangle-exclamation mr-2"></i>
                  Logging an issue moves this asset to <strong>Under Maintenance</strong>.
                </p>
              </div>
            </>
          )}

          {isUpdate && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {MAINTENANCE_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cost">
                  Cost
                </label>

                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Repair cost"
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
                  placeholder="Work done, parts replaced, etc."
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {formData.status === "Resolved" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    <i className="fas fa-circle-check mr-2"></i>
                    Marking this resolved returns the asset to <strong>Available</strong>.
                  </p>
                </div>
              )}
            </>
          )}

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
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
          >
            <i className="fas fa-screwdriver-wrench mr-2"></i>
            {isUpdate ? "Update" : "Log Issue"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default MaintenancePopup;
