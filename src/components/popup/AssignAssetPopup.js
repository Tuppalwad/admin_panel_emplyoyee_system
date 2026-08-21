import React, { useState } from "react";
import { useSelector } from "react-redux";
import { validateAssign } from "../../pages/asset/validate";
import ComponentChecklist, {
  defaultComponentChecks,
  sanitizeComponentChecks,
} from "../common/ComponentChecklist";
import EmployeeSelect from "../common/EmployeeSelect";

function AssignAssetPopup({ asset, onClose, onSubmit }) {
  const { enums } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    empId: "",
    conditionAtAssign: asset?.condition || "",
    remarks: "",
    courierName: "",
    trackingNumber: "",
    shippedToAddress: "",
  });
  const [errors, setErrors] = useState({});

  const [componentChecks, setComponentChecks] = useState(
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
    const newErrors = validateAssign(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      componentChecksAtAssign: sanitizeComponentChecks(componentChecks),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold text-white">Assign Asset</h3>
            <p className="text-blue-100 text-sm mt-0.5">
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
        <div className="p-5 overflow-y-auto">

          <EmployeeSelect
            label="Employee"
            value={formData.empId}
            onChange={(empId) => {
              setErrors((prev) => ({ ...prev, empId: "" }));
              setFormData((prev) => ({ ...prev, empId }));
            }}
            error={errors.empId}
            required
          />

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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Handover notes"
              className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <ComponentChecklist
            label="Component Checks At Assign"
            description="What was verified when the asset went out."
            value={componentChecks}
            onChange={setComponentChecks}
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
                    placeholder="Delivery address"
                    className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white px-5 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            <i className="fas fa-user-check mr-2"></i>
            Assign
          </button>
        </div>

      </div>
    </div>
  );
}

export default AssignAssetPopup;
