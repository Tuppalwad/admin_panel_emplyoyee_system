import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './pages/dashboard';
import { AddEmployee, EmployeeInfo, ViewEmployee } from './pages/employee';
import PrivatedRoute from './components/common/PrivatedRoute';
import { Loading } from './components/common';
import Profile from './components/profile';
import ForgotPass from './pages/auth/ForgotPass';
import SendForgotEmail from './pages/auth/SendForgotEmail';
import VerifyEmail from './components/verifyEmail';
import { AttendanceTable,MonthtyAtteData } from './pages/attendance';
import AllLeaveRequest from './pages/leaves/AllLeaveRequest';
import NotFoundPage from './components/common/NotFoundPage';
import ChangePass from './pages/auth/ChangePass';

function App() {
  return (
    <div className="App">
      <Loading />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password/:id" element={<ForgotPass />} />
          <Route path="/sendresetlink-password" element={<SendForgotEmail />} />
          <Route path="/verifyemail/:id" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<PrivatedRoute />}>
            <Route path="" element={<AdminLayout />}>
              <Route path="changepass" element={<ChangePass/>}/>
              <Route path="employee/add" element={<AddEmployee />} />
              <Route path="employee/view" element={<ViewEmployee />} />
              <Route path="employee/viewinfo" element={<EmployeeInfo />} />
              <Route path="attendance/today_attendance" element={<AttendanceTable />} />
              <Route path="attendance/monthly_attendance" element={<MonthtyAtteData />} />
              <Route path="leave/leave_request" element={<AllLeaveRequest />} />
              <Route path="account" element={<Profile />} />
              <Route path='*' element={<NotFoundPage/>} />
              {/* <Route path="settings" element={<Settings />} /> */}
            </Route>
          </Route>
          <Route path='*' element={<NotFoundPage/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
