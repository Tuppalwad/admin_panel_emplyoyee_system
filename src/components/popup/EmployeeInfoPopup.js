import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAssetsByEmpId } from "../../redux/actions/assetAction";

function EmployeeInfoPopup({
  employee,
  approve,
  reject,
  onClose,
}) {
  const dispatch = useDispatch();
  const [formData] = useState({ ...employee });

  /* Assets are not merged into the employee record server-side, so they are
     fetched separately and shown as their own section. */
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!formData.empId) return;

      const res = await dispatch(getAssetsByEmpId(formData.empId));
      if (res?.code === 200) {
        setAssets(res.data || []);
      }
    };

    fetchAssets();
  }, [dispatch, formData.empId]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const InfoCard = ({ label, value }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>
      <p className="font-medium text-slate-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-user text-3xl"></i>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {formData.FirstName} {formData.LastName}
              </h2>

              <p className="text-sm text-blue-100 mt-1">
                Employee ID : {formData.empId}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs">
                  {formData.Designation}
                </span>

                <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs">
                  {formData.WorkMode}
                </span>

                <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs">
                  {formData.TotalEXP} Years Experience
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Personal Information */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Full Name"
                value={`${formData.FirstName} ${formData.LastName}`}
              />

              <InfoCard
                label="Father's Name"
                value={formData.FathersName}
              />

              <InfoCard
                label="Gender"
                value={formData.Gender}
              />

              <InfoCard
                label="Date of Birth"
                value={formatDate(formData.DOB)}
              />

              <InfoCard
                label="Marital Status"
                value={formData.MaritalStatus}
              />

              <InfoCard
                label="Spouse Name"
                value={formData.SpouseName}
              />

              <InfoCard
                label="Current City"
                value={formData.CurrentCity}
              />

            </div>
          </div>

          {/* Employment Information */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Employment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Employee ID"
                value={formData.empId}
              />

              <InfoCard
                label="Current Employee ID"
                value={formData.CurrentEmpId}
              />

              <InfoCard
                label="Date Of Joining"
                value={formatDate(formData.DateOfJoining)}
              />

              <InfoCard
                label="Designation"
                value={formData.Designation}
              />

              <InfoCard
                label="Employment Type"
                value={formData.EmploymentType}
              />

              <InfoCard
                label="Work Mode"
                value={formData.WorkMode}
              />

              <InfoCard
                label="Status"
                value={formData.status}
              />

            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Email"
                value={formData.Email}
              />

              <InfoCard
                label="Mobile Number"
                value={formData.MobileNo}
              />

              <InfoCard
                label="Emergency Contact"
                value={formData.EmergencyContactNo}
              />

              <InfoCard
                label="Emergency Contact Person"
                value={formData.EmergencyContactPersonName}
              />

            </div>
          </div>

          {/* Education */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Education & Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Highest Qualification"
                value={formData.HighestQualification}
              />

              <InfoCard
                label="Additional Courses"
                value={formData.AdditionalCourses}
              />

              <InfoCard
                label="Total Experience"
                value={`${formData.TotalEXP} Years`}
              />

            </div>

            <div className="mt-4">
              <InfoCard
                label="Skills"
                value={
                  formData.skillAndExperience?.length
                    ? formData.skillAndExperience
                        .map(
                          (item) =>
                            `${item.skill} (${item.experience} Year)`
                        )
                        .join(", ")
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* Identity */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Identity Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="PAN Number"
                value={formData.PANNo}
              />

              <InfoCard
                label="Aadhar Number"
                value={formData.AadharNo}
              />

              <InfoCard
                label="Passport Number"
                value={formData.PassportNo}
              />

              <InfoCard
                label="Name As Per Aadhar"
                value={formData.NameAsPerAadhar}
              />

            </div>
          </div>

          {/* Bank */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Bank Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Bank Account Number"
                value={formData.BankAccountNo}
              />

              <InfoCard
                label="IFSC Code"
                value={formData.IFSCCode}
              />

              <InfoCard
                label="PF Member"
                value={formData.PFMember}
              />

              <InfoCard
                label="UAN Number"
                value={formData.UANNo}
              />

            </div>
          </div>

          {/* Laptop */}
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-2 mb-2.5">
              Laptop Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

              <InfoCard
                label="Laptop Type"
                value={formData.LaptopType}
              />

              <InfoCard
                label="Official Laptop In Use"
                value={formData.HavingOfficialInUse}
              />

              <InfoCard
                label="Official Laptop Serial No."
                value={formData.OfficialLaptopSrNo}
              />

              <InfoCard
                label="RAM"
                value={`${formData.RAM} GB`}
              />

              <InfoCard
                label="Storage Type"
                value={formData.StorageType}
              />

              <InfoCard
                label="Storage Space"
                value={`${formData.StorageSpace} GB`}
              />

              <InfoCard
                label="Official Upgrades"
                value={formData.OfficialUpgrades}
              />

              <InfoCard
                label="Additional Configurations"
                value={formData.AdditionalConfigurations}
              />

            </div>
          </div>

          {/* Assigned Assets */}
          <div className="mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2.5">
              <h3 className="text-base font-semibold">
                Assigned Assets ({assets.length})
              </h3>

              {formData.empId && (
                <Link
                  to={`/dashboard/asset/employee?empId=${encodeURIComponent(formData.empId)}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage assets
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              )}
            </div>

            {assets.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {assets.map((asset) => (
                  <div
                    key={asset._id}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      {asset.category}
                    </p>

                    <p className="font-medium text-slate-800 break-words">
                      {asset.brand} {asset.modelName}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {asset.assetId}
                    </p>

                    <p className="text-sm text-slate-500">
                      Since {formatDate(asset.currentAssignee?.assignedDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                No assets currently assigned.
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white px-5 py-3">

          <div className="flex justify-end gap-2 flex-wrap">

            <button
              onClick={() => approve(formData)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
            >
              <i className="fas fa-check mr-2"></i>
              Approve
            </button>

            <button
              onClick={() => reject(formData)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
            >
              <i className="fas fa-times mr-2"></i>
              Reject
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
            >
              Close
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default EmployeeInfoPopup;