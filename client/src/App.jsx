import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Routing from "../routes/Routing";
import { useAuth } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate("/login/candidate", { state: { from: location }, replace: true });
    return null;
  }

  return children;
};

// Role-based Route Component
const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate("/login/candidate", { state: { from: location }, replace: true });
    return null;
  }

  // If user role is not allowed, redirect to appropriate dashboard
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

const App = () => {
    return (
        <>
            <Navbar />
            <main>
                <Routing />
            </main>
            <Footer />
        </>
    );
};

export default App;
