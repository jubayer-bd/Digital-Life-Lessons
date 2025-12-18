import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Forbidden from "../Components/Forbidden";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  // 3. Loading State
  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  // 4. Not Logged In → Redirect to Login
  if (!user) {
    // Pass the current location in state so you can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 5. Logged In but NOT Admin → Show Custom Forbidden Component
  if (role !== "admin") {
    return <Forbidden />;
  }
  return children;
};

export default AdminRoute;
