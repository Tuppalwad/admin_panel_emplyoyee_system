import React, { useState } from 'react';
import { auth } from '../../services'; // Adjust this import based on your actual service location
import loginimg from '../../asset/login.avif';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';



function SendForgotEmail() {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const notify = (message) => toast(message);

    const {isloading} = useSelector((state) => state.loading);
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await dispatch(auth.sendResetLink(email)); // Adjust this call based on your actual auth method
            if (data.code !== 200) {
                setError(data.message);
                return;
            }
            notify('Reset Link Sent Successfully');
            navigate('/');

        } catch (err) {
            setError('Something went wrong: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen flex">
            <ToastContainer />
            <div className="w-1/2">
                <img src={loginimg} alt="Login" className="w-full h-full object-cover" />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-8">
                    <h1 className="text-2xl font-bold text-center">Reset Password</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {isloading ? 'Loading...' : 'Send Reset Link'}
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

export default SendForgotEmail;
