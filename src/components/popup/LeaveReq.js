    import React from 'react'
    
    function LeaveReq(

        { selectedLeave, handleClosePopup, handleStatusChange }
    ) {
      return (
        <div> <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Leave Request Details</h2>
          <p><strong>Name:</strong> {selectedLeave.name}</p>
          <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
          <p><strong>Leave From:</strong> {selectedLeave.leaveFrom}</p>
          <p><strong>Leave To:</strong> {selectedLeave.leaveTo}</p>
          <p><strong>No. of Days:</strong> {selectedLeave.noOfDays}</p>
          <p><strong>Reason:</strong> {selectedLeave.reason}</p>
          <p><strong>Status:</strong> {selectedLeave.status}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleStatusChange('Approved')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('Rejected')}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
            <button
              onClick={handleClosePopup}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div></div>
      )
    }
    
    export default LeaveReq