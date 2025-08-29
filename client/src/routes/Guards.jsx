import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login/candidate", { state: { from: location }, replace: true });
    return null;
  }

  return children;
};

// Role-based Route Component
export const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login/candidate", { state: { from: location }, replace: true });
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "admin" ? "/dashboard/admin" :
      user.role === "recruiter" ? "/dashboard/recruiter" :
      "/dashboard/candidate";
    navigate(redirectPath, { replace: true });
    return null;
  }

  return children;
};
