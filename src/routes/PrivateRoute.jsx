import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import useRole from "../hooks/useRole";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // const { role, roleLoading } = useRole();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
// if(role) {
//   return <Navigate to='/dashboard/admin'/>
// }
  // If logged in → allow access
  return children;
};

export default PrivateRoute;
