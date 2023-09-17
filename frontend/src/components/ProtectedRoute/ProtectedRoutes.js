import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const isAuth = localStorage.getItem("isUserSignedIn");
  return isAuth === false ? <Navigate to="/login" /> : <Outlet />;
};

export default ProtectedRoutes;
