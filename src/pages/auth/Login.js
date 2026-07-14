import React, { useEffect, useState } from 'react';
import { auth } from '../../services';
import loginimg from '../../asset/login.avif';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedinUser } from '../../services/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const res = await dispatch(isLoggedinUser());
      if (res && res.code === 200) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    };
    checkAuthStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(auth.Login(email, password));
      if (data.code !== 200) {
        setError(data.message);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong ' + err);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2">
        <img src={loginimg} alt="Login" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className="text-center">
            <Link to="/sendresetlink-password" className="text-blue-500">Forgot Password?</Link>
            <p className="mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
