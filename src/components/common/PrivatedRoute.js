import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedinUser } from "../../services/auth";
import Loading from "./Loading";

const PrivatedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means not yet determined

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const res = await dispatch(isLoggedinUser());
      if (res && res.code === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []); // Empty dependency array ensures this runs once on mount

  if (isAuthenticated === null) {
    return (
      <Loading />
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivatedRoute;
