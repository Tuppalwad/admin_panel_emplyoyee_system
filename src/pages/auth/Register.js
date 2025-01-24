import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services'; // Adjust this import based on your actual service location
import Registerimg from '../../asset/register.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

function Register() {
  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {isLoading} = useSelector((state) => state.loading);
  const [error, setError] = useState({
    fullname: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const notify = (message) => toast(message);
  const dispatch = useDispatch()
  const validateFields = () => {
    let errors = {};
    if (!fullname) errors.fullname = 'Full Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!role) errors.role = 'Role is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const data = await dispatch(auth.registerAdmin({ fullname, email, password, role}));
      console.log(data);
      if (data.code !== 200) {
        setError({ general: data.message });
        return;
      }
      notify('Verification email sent to your email address please verify your email address');
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect to login page after 3 seconds

    } catch (err) {
      setError({ general: 'Something went wrong: ' + err.message });
    }
    finally {
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <div className="w-1/2">
        <img src={Registerimg} alt="Login" className="w-full h-full object-fill" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8">
          <h1 className="text-2xl font-bold text-center">Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => {setName(e.target.value)
                setError({ ...error, fullname: '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {setEmail(e.target.value)
                setError({ ...error, email: '' });
              } }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)
                setError({ ...error, password: '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {setConfirmPassword(e.target.value)
                setError({ ...error, confirmPassword: '' });

                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
            </div>
            <div>
              <select
                value={role}
                onChange={(e) => {setRole(e.target.value)

                setError({ ...error, role: '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="CEO">CEO</option>
                <option value="HR">HR</option>
                <option value="MANAGER">MANAGER</option>
                <option value="FOUNDER">FOUNDER</option>
                <option value="CO-FOUNDER">CO-FOUNDER</option>
              </select>
              {error.role && <p className="text-red-500 text-sm">{error.role}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            {error.general && <p className="text-red-500 text-sm text-center mt-2">{error.general}</p>}
          </form>
          <div className="text-center mt-4">
            <Link to="/" className="text-blue-500">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
