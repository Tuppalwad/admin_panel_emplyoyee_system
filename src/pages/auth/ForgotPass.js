import React, { useState } from 'react';
import { auth } from '../../services'; // Adjust this import based on your actual service location
import loginimg from '../../asset/login.avif';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';


function ForgotPass() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isloading} = useSelector((state) => state.loading);
  const token = window.location.pathname.split('/')[2];

  const notify = (message) => toast(message);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const data = await dispatch(auth.resetPassword(token, password)); // Adjust this call based on your actual auth method
      if (data.code !== 200) {
        setError(data.message);
        return;
      }
      notify('Password Reset Successfully');
      navigate('/');
    } catch (err) {
      setError('Something went wrong: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2">
        <img src={loginimg} alt="Login" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
              <div className="w-full max-w-md p-8 space-y-8">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isloading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isloading ? 'Loading...' : 'Reset Password'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/" className="text-blue-500">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPass;
