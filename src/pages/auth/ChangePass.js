import React, { useState } from 'react';
import { auth } from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

function ChangePass() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        notMatch: '',
    });

    const { isLoading } = useSelector((state) => state.loading);
    const dispatch = useDispatch();
    const decodedToken =  jwtDecode(localStorage.getItem('token'));
    const email = decodedToken?.email;
    const notify = message => toast(message);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            notMatch: '',
        });

        if (!oldPassword) {
            setError(prevError => ({ ...prevError, oldPassword: 'Old password is required' }));
            return;
        }
        if (!newPassword) {
            setError(prevError => ({ ...prevError, newPassword: 'New password is required' }));
            return;
        }
        if (!newPasswordConfirm) {
            setError(prevError => ({ ...prevError, newPasswordConfirm: 'Confirm new password is required' }));
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            setError(prevError => ({ ...prevError, notMatch: 'New password and confirm password do not match' }));
            return;
        }

        try {
            const data = await dispatch(auth.changePassword(email,oldPassword, newPassword));
            if (data.code !== 200) {
                notify(data.message);
                return;
            }
            notify(data.message);
            setOldPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
        } catch (err) {
            notify('Something went wrong');
            setNewPassword('');
            setNewPasswordConfirm('');
            setOldPassword('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.oldPassword && <p className="text-red-500 text-sm">{error.oldPassword}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.newPassword && <p className="text-red-500 text-sm">{error.newPassword}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.newPasswordConfirm && <p className="text-red-500 text-sm">{error.newPasswordConfirm}</p>}
                        {error.notMatch && <p className="text-red-500 text-sm">{error.notMatch}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isLoading ? 'Loading...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePass;
