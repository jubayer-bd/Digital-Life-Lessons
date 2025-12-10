import React from "react";
import { Navigate, useLocation } from "react-router"; // USE Navigate component, not useNavigate
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  // If no user → redirect to login
  if (!user) {
    return <Navigate state={location.pathname} to="/auth/login" replace />;
  }

  // If user logged in → show protected content
  return children;
};

export default PrivateRoute;
