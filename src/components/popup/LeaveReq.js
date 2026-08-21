import React, { useMemo } from 'react';

const isLeaveFromDateExpired = (startDate) => {
const today = new Date();
today.setHours(0, 0, 0, 0);

const fromDate = new Date(startDate);
fromDate.setHours(0, 0, 0, 0);

return fromDate < today;
};

function LeaveReq({
selectedLeave,
handleClosePopup,
handleStatusChange,
}) {
const isFromDateExpired = useMemo(
() => isLeaveFromDateExpired(selectedLeave.startDate),
[selectedLeave.startDate]
);

const isActionDisabled =
isFromDateExpired ||
selectedLeave.status !== 'Pending';

const totalDays =
Math.ceil(
(new Date(selectedLeave.endDate) -
new Date(selectedLeave.startDate)) /
(1000 * 60 * 60 * 24)
) + 1;

const statusColors = {
Approved: 'bg-green-100 text-green-700',
Pending: 'bg-yellow-100 text-yellow-700',
Rejected: 'bg-red-100 text-red-700',
};

const InfoCard = ({ label, value }) => ( <div className="bg-slate-50 border border-slate-200 rounded-lg p-3"> <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
{label} </p> <p className="font-medium text-slate-800">
{value || 'N/A'} </p> </div>
);

return ( <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">

  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-300 px-5 py-4 text-white">

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <i className="fas fa-calendar-alt text-lg"></i>
        </div>

        <div>
          <h2 className="text-lg font-bold  text-white">
            Leave Request Details
          </h2>

          <p className="text-sm text-blue-100">
            Review and manage employee leave request
          </p>
        </div>

      </div>

    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto p-5">

      {/* Employee Info */}
      <div className="mb-4">

        <h3 className="text-base font-semibold text-slate-800 border-b pb-2 mb-3">
          Employee Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <InfoCard
            label="Employee Name"
            value={selectedLeave.fullName}
          />

          <InfoCard
            label="Leave Type"
            value={selectedLeave.type}
          />

        </div>

      </div>

      {/* Leave Details */}
      <div className="mb-4">

        <h3 className="text-base font-semibold text-slate-800 border-b pb-2 mb-3">
          Leave Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          <InfoCard
            label="Leave From"
            value={new Date(
              selectedLeave.startDate
            ).toLocaleDateString()}
          />

          <InfoCard
            label="Leave To"
            value={new Date(
              selectedLeave.endDate
            ).toLocaleDateString()}
          />

          <InfoCard
            label="Total Days"
            value={`${totalDays} Days`}
          />

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Status
            </p>

            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                statusColors[selectedLeave.status]
              }`}
            >
              {selectedLeave.status}
            </span>
          </div>

        </div>

      </div>

      {/* Reason */}
      <div>

        <h3 className="text-base font-semibold text-slate-800 border-b pb-2 mb-3">
          Leave Reason
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">

          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedLeave.reason}
          </p>

        </div>

      </div>

      {/* Warning */}
      {isFromDateExpired && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">

          <div className="flex items-start gap-3">

            <i className="fas fa-exclamation-circle text-red-500 mt-1"></i>

            <div>
              <h4 className="font-semibold text-red-700">
                Action Restricted
              </h4>

              <p className="text-red-600 text-sm">
                This leave request can no longer be approved or rejected because the leave start date has already passed.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>

    {/* Footer */}
    <div className="border-t border-slate-200 bg-white px-5 py-3 shrink-0">

      <div className="flex flex-col sm:flex-row justify-end gap-2">

        <button
          type="button"
          onClick={() => handleStatusChange('Approved')}
          disabled={isActionDisabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isActionDisabled
              ? 'bg-green-300 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <i className="fas fa-check mr-2"></i>
          Approve
        </button>

        <button
          type="button"
          onClick={() => handleStatusChange('Rejected')}
          disabled={isActionDisabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            isActionDisabled
              ? 'bg-red-300 text-white cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <i className="fas fa-times mr-2"></i>
          Reject
        </button>

        <button
          type="button"
          onClick={handleClosePopup}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
        >
          Close
        </button>

      </div>

    </div>

  </div>

</div>

);
}

export default LeaveReq;
