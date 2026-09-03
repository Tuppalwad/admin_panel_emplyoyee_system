import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateAssign } from "../../pages/asset/validate";
import ComponentChecklist, {
  defaultComponentChecks,
  sanitizeComponentChecks,
} from "../common/ComponentChecklist";
import EmployeeSelect from "../common/EmployeeSelect";
import { getAssetsByEmpId } from "../../redux/actions/assetAction";

/* Only two decisions matter here — who gets it, and in what state — so those stay on screen and
   everything optional folds away.

   The employee card is not decoration: there are two people called "Manish Sharma" on different
   empIds, so identity and current holdings are shown before the handover is confirmed. */

const CATEGORY_ICON = {
  Laptop: "fa-laptop",
  Mobile: "fa-mobile-screen",
  Keyboard: "fa-keyboard",
  Mouse: "fa-computer-mouse",
  Headphone: "fa-headphones",
  RAM: "fa-memory",
  SSD: "fa-hard-drive",
  Monitor: "fa-desktop",
  Charger: "fa-plug",
  Other: "fa-box",
};

const CONDITION_STYLE = {
  New: "bg-emerald-600 border-emerald-600",
  Good: "bg-green-600 border-green-600",
  Fair: "bg-yellow-500 border-yellow-500",
  Damaged: "bg-orange-600 border-orange-600",
  "Beyond Repair": "bg-red-600 border-red-600",
};

function Section({ open, onToggle, icon, title, hint, badge, children }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <i className={`fas ${icon} text-slate-400`}></i>
          {title}
          {badge ? (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          ) : (
            <span className="text-slate-400 font-normal text-xs">{hint}</span>
          )}
        </span>

        <i className={`fas fa-chevron-${open ? "up" : "down"} text-xs text-slate-400`}></i>
      </button>

      {open && <div className="p-4 border-t border-slate-200">{children}</div>}
    </div>
  );
}

function AssignAssetPopup({ asset, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const { enums } = useSelector((state) => state.assets);
  const { allEmployees = [] } = useSelector((state) => state.employee) || {};

  const [formData, setFormData] = useState({
    empId: "",
    conditionAtAssign: asset?.condition || "Good",
    remarks: "",
    courierName: "",
    trackingNumber: "",
    shippedToAddress: "",
  });
  const [errors, setErrors] = useState({});

  const [componentChecks, setComponentChecks] = useState(
    defaultComponentChecks(asset?.category)
  );

  const [delivery, setDelivery] = useState("person");
  const [openSection, setOpenSection] = useState(null);

  const [holdings, setHoldings] = useState(null);

  const employee = allEmployees.find((item) => item.empId === formData.empId);
  const employeeName =
    employee?.fullName ||
    `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim();

  /* Escape closes — a modal that traps you until you find the × is its own annoyance. */
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!formData.empId) {
      setHoldings(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await dispatch(getAssetsByEmpId(formData.empId));
      if (!cancelled) setHoldings(res?.code === 200 ? res.data || [] : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, formData.empId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checksFilled = sanitizeComponentChecks(componentChecks)?.length || 0;

  const handleSubmit = () => {
    const newErrors = validateAssign(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      /* Courier fields are only meaningful for a shipped handover — sending them for an
         in-person one would record a delivery that never happened. */
      courierName: delivery === "courier" ? formData.courierName : "",
      trackingNumber: delivery === "courier" ? formData.trackingNumber : "",
      shippedToAddress: delivery === "courier" ? formData.shippedToAddress : "",
      componentChecksAtAssign: sanitizeComponentChecks(componentChecks),
    });
  };

  const sameCategoryHeld = (holdings || []).filter(
    (item) => item.category === asset?.category
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <i className={`fas ${CATEGORY_ICON[asset?.category] || "fa-box"} text-lg`}></i>
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-800 truncate">
                {asset?.brand} {asset?.modelName}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {asset?.assetId}
                {asset?.serialNumber ? ` · S/N ${asset.serialNumber}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none shrink-0"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">

          {/* --- Step 1: who --- */}
          <div>
            <label className="block text-slate-800 text-sm font-bold mb-2">
              Who is receiving this? <span className="text-red-500">*</span>
            </label>

            <EmployeeSelect
              value={formData.empId}
              onChange={(empId) => {
                setErrors((prev) => ({ ...prev, empId: "" }));
                setFormData((prev) => ({ ...prev, empId }));
              }}
              error={errors.empId}
              autoFocus
              isClearable
              hideLabel
              hideHint
            />

            {/* Confirms the right person, and warns before a duplicate goes out */}
            {formData.empId && (
              <div className="mt-3 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
                    {(employeeName || formData.empId).charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {employeeName || formData.empId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formData.empId}
                      {employee?.worktype ? ` · ${employee.worktype}` : ""}
                      {holdings === null
                        ? " · checking current assets…"
                        : ` · currently holds ${holdings.length} asset(s)`}
                    </p>
                  </div>
                </div>

                {sameCategoryHeld.length > 0 && (
                  <p className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <i className="fas fa-triangle-exclamation mr-2"></i>
                    Already holds {sameCategoryHeld.length} {asset?.category}
                    {" — "}
                    {sameCategoryHeld.map((item) => item.assetId).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* --- Step 2: condition --- */}
          <div>
            <label className="block text-slate-800 text-sm font-bold mb-2">
              Condition going out <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {enums.CONDITIONS.map((condition) => {
                const active = formData.conditionAtAssign === condition;
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => {
                      setErrors((prev) => ({ ...prev, conditionAtAssign: "" }));
                      setFormData((prev) => ({ ...prev, conditionAtAssign: condition }));
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${active
                      ? `${CONDITION_STYLE[condition] || "bg-slate-700 border-slate-700"} text-white`
                      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Pre-set from the asset's recorded condition ({asset?.condition || "unknown"}).
            </p>

            {errors.conditionAtAssign && (
              <p className="text-red-500 text-xs italic mt-2">{errors.conditionAtAssign}</p>
            )}
          </div>

          {/* --- Step 3: delivery --- */}
          <div>
            <label className="block text-slate-800 text-sm font-bold mb-2">
              How is it being handed over?
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "person", icon: "fa-hand-holding-hand", title: "In person" },
                { key: "courier", icon: "fa-truck-fast", title: "Courier" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setDelivery(option.key)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition ${delivery === option.key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <i className={`fas ${option.icon}`}></i>
                  {option.title}
                </button>
              ))}
            </div>

            {delivery === "courier" && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="courierName"
                  value={formData.courierName}
                  onChange={handleChange}
                  placeholder="Courier name (e.g. Blue Dart)"
                  className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  placeholder="Tracking number"
                  className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                <textarea
                  name="shippedToAddress"
                  rows={2}
                  value={formData.shippedToAddress}
                  onChange={handleChange}
                  placeholder="Delivery address"
                  className="md:col-span-2 shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
          </div>

          {/* --- Optional, folded away --- */}
          <Section
            open={openSection === "checks"}
            onToggle={() => setOpenSection(openSection === "checks" ? null : "checks")}
            icon="fa-list-check"
            title="Component checks"
            hint="(optional)"
            badge={checksFilled ? `${checksFilled} filled` : null}
          >
            <ComponentChecklist
              label="What was verified"
              description="Only rows with both a component and a status are saved."
              value={componentChecks}
              onChange={setComponentChecks}
              category={asset?.category}
            />
          </Section>

          <Section
            open={openSection === "remarks"}
            onToggle={() => setOpenSection(openSection === "remarks" ? null : "remarks")}
            icon="fa-note-sticky"
            title="Remarks"
            hint="(optional)"
            badge={formData.remarks ? "added" : null}
          >
            <textarea
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Handover notes"
              className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Section>

        </div>

        {/* Footer — always visible, never scrolls out of reach */}
        <div className="border-t border-slate-200 bg-white px-5 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 truncate">
            {formData.empId
              ? `${asset?.assetId} → ${employeeName || formData.empId}`
              : "Pick an employee to continue"}
          </p>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 text-slate-600"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!formData.empId}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-user-check mr-2"></i>
              Assign
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AssignAssetPopup;
