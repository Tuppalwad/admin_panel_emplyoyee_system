import React, { useState } from "react";

function EmployeeInfoPopup({
  employee,
  approve,
  reject,
  onClose,
}) {
  const [formData] = useState({ ...employee });

  const InfoCard = ({ label, value }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
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
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-300 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-user text-5xl"></i>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                {`${formData.FirstName || ""} ${
                  formData.MiddleName || ""
                } ${formData.LastName || ""}`}
              </h2>

              <p className="text-blue-100 mt-2">
                Employee ID : {formData.empId}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {formData.Gender}
                </span>

                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {formData.education}
                </span>

                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {formData.workExperience} Experience
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Body */}
       <div className="flex-1 overflow-y-auto p-6">

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <InfoCard
                label="Full Name"
                value={`${formData.FirstName || ""} ${
                  formData.MiddleName || ""
                } ${formData.LastName || ""}`}
              />

              <InfoCard
                label="Gender"
                value={formData.Gender}
              />

              <InfoCard
                label="Date Of Birth"
                value={
                  formData.DOB
                    ? new Date(
                        formData.DOB
                      ).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoCard
                label="Marital Status"
                value={formData.maritalStatus}
              />

              <InfoCard
                label="Blood Group"
                value={formData.BloodGroup}
              />

              <InfoCard
                label="Physically Disabled"
                value={
                  formData.PhysicallyDisabled
                    ? "Yes"
                    : "No"
                }
              />

            </div>
          </div>

          {/* Employment Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">
              Employment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <InfoCard
                label="Employee ID"
                value={formData.empId}
              />

              <InfoCard
                label="Date Of Joining"
                value={
                  formData.DateOfJoining
                    ? new Date(
                        formData.DateOfJoining
                      ).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoCard
                label="Education"
                value={formData.education}
              />

              <InfoCard
                label="Work Experience"
                value={formData.workExperience}
              />

              <InfoCard
                label="Year Of Passing"
                value={
                  formData.YearOfPassing
                    ? new Date(
                        formData.YearOfPassing
                      ).getFullYear()
                    : "N/A"
                }
              />

            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <InfoCard
                label="Email"
                value={formData.Email}
              />

              <InfoCard
                label="Contact Number"
                value={formData.ContactNo}
              />

              <InfoCard
                label="Emergency Contact"
                value={formData.EmergencyContactNo}
              />

            </div>
          </div>

          {/* Identity Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">
              Identity Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <InfoCard
                label="PAN Card"
                value={formData.PANcardNo}
              />

              <InfoCard
                label="Aadhar Card"
                value={formData.AdharcardNo}
              />

            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">
              Address Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <InfoCard
                label="Present Address"
                value={formData.PresentAddress}
              />

              <InfoCard
                label="Permanent Address"
                value={formData.PermanetAddress}
              />

            </div>
          </div>

        </div>

        {/* Footer */}
       <div className="border-t border-slate-200 bg-white p-5 shrink-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">

            <button
              onClick={() => approve(formData)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
            >
              <i className="fas fa-check mr-2"></i>
              Approve
            </button>

            <button
              onClick={() => reject(formData)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
            >
              <i className="fas fa-times mr-2"></i>
              Reject
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition"
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