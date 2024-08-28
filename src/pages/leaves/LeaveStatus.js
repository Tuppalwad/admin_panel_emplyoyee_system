import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { setStatusofLeave } from '../../redux/actions/leaveAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LeaveStatus() {
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const notify = (message) => toast(message);

  const dispatch = useDispatch();
  const { id } = useParams(); // Extracts the id from the URL
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const empId = queryParams.get('empid');
  const leaveStatus = queryParams.get('status');


  console.log(id, empId, leaveStatus);

  const statusLeave = async () => {
    const data = {
      leaveId: id,
      empId,
      status: leaveStatus,
      rejectReason: reason
    };

    const res = await dispatch(setStatusofLeave(data));
    console.log(res);

    if (res.code === 200) {
      setStatus(leaveStatus);
      notify(`Leave ${leaveStatus}`);
    } else {
      notify('Something went wrong!');
    }
  };

  useEffect(() => {
    if (leaveStatus === 'Approved') {
      statusLeave();
    }
    setStatus(leaveStatus)

  }, []);

  const handleSubmit = async () => {
    const res = await dispatch(setStatusofLeave({
      leaveId: id,
      empId,
      status: 'Rejected',
      rejectReason: reason
    }));

    if (res.code === 200) {
      notify('Leave Rejected');
      setStatus('Rejected');
      setReason('');
    } else {
      notify('Failed to reject leave');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />
      {status === "Approved" ? (
        <div 
          className="flex flex-col items-center justify-center text-green-500 font-bold"
        >Leave approved</div>
      ) : status === 'Rejected' ? (
        <div
          className="flex flex-col items-center justify-center"
        >
          <textarea
            className="border border-gray-300 p-2 rounded mb-4 w-80"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please enter reason"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default LeaveStatus;
