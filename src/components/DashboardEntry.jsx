// DashboardEntry.jsx (or put this inside your routes file)
import React from 'react';
import { Navigate } from 'react-router-dom';
import useRole from '../hooks/useRole';
import PageLoader from './PageLoader';
import DashboardHome from '../pages/Dashboard/DashboardHome';



const DashboardEntry = () => {
  const { role, roleLoading } = useRole();

  // 1. Show loader while checking role
  if (roleLoading) return <PageLoader />;

  // 2. If Admin, REDIRECT to the admin specific route
  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  // 3. If User (or other), show the standard User Dashboard
  return <DashboardHome />;
};

export default DashboardEntry;