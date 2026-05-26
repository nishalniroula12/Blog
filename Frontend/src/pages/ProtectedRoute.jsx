import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isloggedin = localStorage.getItem("loggedin");
  console.log("protectd route",isloggedin)

 return isloggedin   ? <Outlet />
    : <Navigate to="/login" replace />;
};
export default ProtectedRoute;