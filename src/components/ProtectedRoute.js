import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" />;
  }

  const hasAccess = user?.roles?.some((role) => allowedRoles.includes(role));
  if (!hasAccess) {
    return ;
  }
  return <Outlet />;
};

export default ProtectedRoute;
