import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const getToken = () => {
  return localStorage.getItem('token');
};

const getRole = () => {
  return localStorage.getItem('userRole');
};

const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

const isAdmin = () => {
  const role = getRole();
  return role === 'ADMIN';
};

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
