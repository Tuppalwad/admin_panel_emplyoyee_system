import React, { useState } from 'react';

function EmployeeInfoPopup({ employee, approve, reject, onClose }) {
  const [formData, setFormData] = useState({ ...employee });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 w-full max-w-5xl mx-2">
        <h2 className="text-xl font-bold mb-4 ">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="mb-1  mt-3 col-span-3">
            <label className="block  text-gray-700">Full Name</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{`${formData.FirstName} ${formData.MiddleName} ${formData.LastName}`}</p>
          </div>
          <div className="mb-1  mt-3 col-span-3">
            <label className="block  text-gray-700">Email</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.Email}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Employee ID</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.empId}</p>
          </div>
          
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Date of Joining</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{new Date(formData.DateOfJoining).toLocaleDateString()}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Year of Passing</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.YearOfPassing}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Contact No</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.ContactNo}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Gender</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.Gender}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">DOB</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{new Date(formData.DOB).toLocaleDateString()}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Education</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.education}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Work Experience</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.workExperience}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Blood Group</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.BloodGroup}</p>
          </div>
          
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">PAN Card No</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.PANcardNo}</p>
          </div>
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Aadhar Card No</label>
            <p className="w-full px-2 mt-1 py-2 border border-gray-300 rounded">{formData.AdharcardNo}</p>
          </div>
        
          <div className="mb-1  mt-3">
            <label className="block  text-gray-700">Marital Status</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.maritalStatus}</p>
          </div>
          <div className="mb-1  mt-3 col-span-2">
            <label className="block  text-gray-700">Physically Disabled</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.PhysicallyDisabled ? 'Yes' : 'No'}</p>
          </div>
          <div className="mb-1  mt-3 col-span-2">
            <label className="block  text-gray-700">Emergency Contact No</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.EmergencyContactNo}</p>
          </div>
          <div className="mb-1  mt-3 col-span-2">
            <label className="block  text-gray-700">Permanent Address</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.PermanetAddress}</p>
          </div>
          <div className="mb-1  mt-3 col-span-2" >
            <label className="block  text-gray-700 ">Present Address</label>
            <p className="w-full px-3 mt-1 py-2 border border-gray-300 rounded">{formData.PresentAddress}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => approve(formData)}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => reject(formData)}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeInfoPopup;
